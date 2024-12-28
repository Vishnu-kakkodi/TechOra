"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chat_model_1 = __importDefault(require("./models/chat.model"));
class SocketConfig {
    constructor() {
        this.io = null;
        this.onlineUsers = new Map();
    }
    initializeSocket(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: [
                    'http://localhost:5173',
                    'http://localhost:5000'
                ],
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET_KEY);
                // @ts-ignore
                socket.user = decoded;
                next();
            }
            catch (error) {
                next(new Error('Authentication error'));
            }
        });
        this.io.on('connection', (socket) => {
            // @ts-ignore
            const userId = socket.user._id;
            if (!this.onlineUsers.has(userId)) {
                this.onlineUsers.set(userId, new Set());
            }
            socket.on('join_chat', async (chatPartnerId) => {
                var _a, _b, _c, _d;
                const roomId = this.generateRoomId(userId, chatPartnerId);
                socket.join(roomId);
                (_a = this.onlineUsers.get(userId)) === null || _a === void 0 ? void 0 : _a.add(roomId);
                const partnerOnline = ((_b = this.onlineUsers.get(chatPartnerId)) === null || _b === void 0 ? void 0 : _b.has(roomId)) || false;
                (_c = this.io) === null || _c === void 0 ? void 0 : _c.to(roomId).emit('presence_update', {
                    roomId,
                    users: {
                        [userId]: true,
                        [chatPartnerId]: partnerOnline
                    }
                });
                try {
                    await chat_model_1.default.updateMany({
                        roomId,
                        receiverId: userId,
                        isRead: false
                    }, {
                        $set: { isRead: true }
                    });
                    (_d = this.io) === null || _d === void 0 ? void 0 : _d.to(roomId).emit('messages_read', {
                        readBy: userId,
                        timestamp: new Date(),
                    });
                }
                catch (error) {
                    console.error('Error updating message read status:', error);
                }
                console.log(`User ${userId} joined room ${roomId}`);
            });
            socket.on('mark_messages_read', async (chatPartnerId) => {
                var _a;
                try {
                    const roomId = this.generateRoomId(userId, chatPartnerId);
                    await chat_model_1.default.updateMany({
                        roomId,
                        receiverId: userId,
                        isRead: false
                    }, {
                        $set: { isRead: true }
                    });
                    (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(roomId).emit('messages_read', {
                        readBy: userId,
                        timestamp: new Date()
                    });
                }
                catch (error) {
                    console.error('Error marking messages as read:', error);
                }
            });
            socket.on('fetch_chat_history', async (chatPartnerId, callback) => {
                try {
                    const roomId = this.generateRoomId(userId, chatPartnerId);
                    const messages = await chat_model_1.default.find({
                        roomId: roomId
                    }).sort({ timestamp: 1 });
                    callback({
                        success: true,
                        messages: messages
                    });
                }
                catch (error) {
                    console.error('Error fetching chat history:', error);
                    callback({
                        success: false,
                        error: 'Failed to fetch chat history'
                    });
                }
            });
            socket.on('send_message', async (messageData) => {
                try {
                    const { senderId, receiverId, sender, text, id, timestamp } = messageData;
                    const roomId = this.generateRoomId(senderId, receiverId);
                    if (!senderId || !receiverId || !text || !roomId || !sender) {
                        socket.emit('error_message', { error: 'Invalid message data' });
                        return;
                    }
                    const message = await chat_model_1.default.create({
                        senderId,
                        receiverId,
                        currentUserType: sender,
                        content: text,
                        roomId,
                        timestamp: timestamp || new Date(),
                        isRead: false,
                        isDelivered: true
                    });
                    this.io.to(roomId).emit('receive_message', {
                        id,
                        senderId,
                        receiverId,
                        text,
                        roomId,
                        timestamp: message.timestamp,
                        isRead: false,
                        isDelivered: true
                    });
                    socket.emit('message_sent', {
                        success: true,
                        message: 'Message sent successfully',
                        data: message,
                    });
                }
                catch (error) {
                    console.error('Error handling send_message:', error);
                    socket.emit('error_message', { error: 'Message delivery failed' });
                }
            });
            socket.on('message_seen', async ({ messageIds, senderId, receiverId }) => {
                try {
                    const roomId = this.generateRoomId(senderId, receiverId);
                    await chat_model_1.default.updateMany({
                        _id: { $in: messageIds },
                        receiverId: userId
                    }, {
                        $set: { isRead: true }
                    });
                    this.io.to(roomId).emit('messages_read_status', {
                        messageIds,
                        readBy: userId,
                        timestamp: new Date()
                    });
                }
                catch (error) {
                    console.error('Error updating message read status:', error);
                }
            });
            socket.on('disconnect', () => {
                const userRooms = this.onlineUsers.get(userId) || new Set();
                this.onlineUsers.delete(userId);
                userRooms.forEach(roomId => {
                    var _a;
                    (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(roomId).emit('presence_update', {
                        roomId,
                        users: {
                            [userId]: false
                        }
                    });
                });
                console.log('Socket disconnected:', socket.id);
            });
        });
        return this.io;
    }
    generateRoomId(userId1, userId2) {
        return [userId1, userId2].sort().join('_');
    }
}
exports.default = new SocketConfig();
//# sourceMappingURL=socketConfig.js.map