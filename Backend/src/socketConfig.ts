import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import MessageModel from './models/chat.model';
import SocketUtils from './utils/socketUtils';
import { DecodedToken } from './helperFunction/authHelper';

class SocketConfig {
  private io: Server | null = null;

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
      
      // Create or join a unique chat room
      socket.on('join_chat', (chatPartnerId) => {
        // Create a unique room ID by sorting and combining user IDs
        const roomId = this.generateRoomId(userId, chatPartnerId);
        
        // Join the specific room
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
      });


      socket.on('fetch_chat_history', async (chatPartnerId, callback) => {
        try {
          const roomId = this.generateRoomId(userId, chatPartnerId);
          
          // Fetch messages for this room, sorted by timestamp
          const messages = await MessageModel.find({ 
            roomId: roomId 
          }).sort({ timestamp: 1 });

          // Invoke callback with messages
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
      
          // Create message in database
          const message = await MessageModel.create({
            senderId,
            receiverId,
            currentUserType: sender,
            content: text,
            roomId, // Store room ID in message
            timestamp: timestamp || new Date(),
          });
      
          // Broadcast to the specific room
          this.io!.to(roomId).emit('receive_message', {
            id,
            senderId,
            receiverId,
            text,
            roomId,
            timestamp: message.timestamp,
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
      
      socket.on('disconnect', () => {
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