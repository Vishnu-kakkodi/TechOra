"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketUtils {
    constructor() {
        this.onlineUsers = new Map(); // Map userId to socketId
    }
    /**
     * Tracks when a user connects and stores their socketId.
     * @param socket - The socket instance of the user.
     * @param userId - The user's unique identifier.
     */
    handleUserOnline(socket, userId) {
        this.onlineUsers.set(userId, socket.id);
        console.log(`${userId} is online`);
    }
    /**
     * @param socket - The socket instance of the disconnecting user.
     */
    handleUserOffline(socket) {
        this.onlineUsers.forEach((id, userId) => {
            if (id === socket.id) {
                this.onlineUsers.delete(userId);
                console.log(`${userId} is offline`);
            }
        });
    }
    /**
     * Finds the recipient's socket instance by userId.
     * @param io - The Socket.IO server instance.
     * @param userId - The recipient's user ID.
     * @returns The recipient's socket instance, or null if not found.
     */
    findRecipientSocket(io, userId) {
        const socketId = this.onlineUsers.get(userId);
        return socketId ? io.sockets.sockets.get(socketId) : null;
    }
}
exports.default = new SocketUtils();
//# sourceMappingURL=socketUtils.js.map