import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import MessageModel from './models/chat.model';
import SocketUtils from './utils/socketUtils';
import { DecodedToken } from './helperFunction/authHelper';

class SocketConfig {
  private io: Server | null = null;
  private onlineUsers: Map<string, Set<string>> = new Map(); 


  initializeSocket(server: HttpServer) {
    this.io = new Server(server, {
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
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY as string) as DecodedToken;
        // @ts-ignore
        socket.user = decoded;
        next();
      } catch (error) {
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
        const roomId = this.generateRoomId(userId, chatPartnerId);
        
        socket.join(roomId);

        this.onlineUsers.get(userId)?.add(roomId);

        const partnerOnline = this.onlineUsers.get(chatPartnerId)?.has(roomId) || false;

        this.io?.to(roomId).emit('presence_update', {
          roomId,
          users: {
            [userId]: true,
            [chatPartnerId]: partnerOnline
          }
        });

        try {
          await MessageModel.updateMany(
            { 
              roomId,
              receiverId: userId,
              isRead: false 
            },
            { 
              $set: { isRead: true } 
            }
          );

          this.io?.to(roomId).emit('messages_read', {
            readBy: userId,
            timestamp: new Date(),
          });
          

        } catch (error) {
          console.error('Error updating message read status:', error);
        }
        console.log(`User ${userId} joined room ${roomId}`);
      });

      socket.on('mark_messages_read', async (chatPartnerId) => {
        try {
          const roomId = this.generateRoomId(userId, chatPartnerId);
          
          await MessageModel.updateMany(
            { 
              roomId,
              receiverId: userId,
              isRead: false 
            },
            { 
              $set: { isRead: true } 
            }
          );

          this.io?.to(roomId).emit('messages_read', {
            readBy: userId,
            timestamp: new Date()
          });

        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });


      socket.on('fetch_chat_history', async (chatPartnerId, callback) => {
        try {
          const roomId = this.generateRoomId(userId, chatPartnerId);
          
          const messages = await MessageModel.find({ 
            roomId: roomId 
          }).sort({ timestamp: 1 });

          callback({
            success: true,
            messages: messages
          });
        } catch (error) {
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
      
          const message = await MessageModel.create({
            senderId,
            receiverId,
            currentUserType: sender,
            content: text,
            roomId, 
            timestamp: timestamp || new Date(),
            isRead:false,
            isDelivered: true
          });
      
          this.io!.to(roomId).emit('receive_message', {
            id,
            senderId,
            receiverId,
            text,
            roomId,
            timestamp: message.timestamp,
            isRead:false,
            isDelivered: true
          });
      
          socket.emit('message_sent', {
            success: true,
            message: 'Message sent successfully',
            data: message,
          });
        } catch (error) {
          console.error('Error handling send_message:', error);
          socket.emit('error_message', { error: 'Message delivery failed' });
        }
      });

      socket.on('message_seen', async ({ messageIds, senderId, receiverId }) => {
        try {
          const roomId = this.generateRoomId(senderId, receiverId);
          
          await MessageModel.updateMany(
            { 
              _id: { $in: messageIds },
              receiverId: userId
            },
            { 
              $set: { isRead: true }
            }
          );

          this.io!.to(roomId).emit('messages_read_status', {
            messageIds,
            readBy: userId,
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Error updating message read status:', error);
        }
      });

      
      socket.on('disconnect', () => {
        const userRooms = this.onlineUsers.get(userId) || new Set();
        this.onlineUsers.delete(userId);
        userRooms.forEach(roomId => {
          this.io?.to(roomId).emit('presence_update', {
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

  private generateRoomId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  }
}

export default new SocketConfig();