import { Server, Socket } from 'socket.io';

class SocketUtils {
  private onlineUsers: Map<string, string>;

  constructor() {
    this.onlineUsers = new Map(); // Map userId to socketId
  }

  /**
   * Tracks when a user connects and stores their socketId.
   * @param socket - The socket instance of the user.
   * @param userId - The user's unique identifier.
   */
  handleUserOnline(socket: Socket, userId: string) {
    this.onlineUsers.set(userId, socket.id);
    console.log(`${userId} is online`);
  }

  /**
   * @param socket - The socket instance of the disconnecting user.
   */
  handleUserOffline(socket: Socket) {
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
  findRecipientSocket(io: Server, userId: string) {
    const socketId = this.onlineUsers.get(userId);
    return socketId ? io.sockets.sockets.get(socketId) : null;
  }
}

export default new SocketUtils();
