
  import { useState, useEffect, useCallback, useRef } from 'react';
  import io, { Socket } from 'socket.io-client';
  
  interface Message {
    id: string; 
    text: string;
    sender: "user" | "tutor";
    timestamp: number;
    status?: "sending" | "sent" | "failed";
    isRead?: boolean;
    isDelivered?: boolean;
  }
  interface UseSocketProps {
    token?: string;
    senderId?: string;
    receiverId?: string | null;
    onMessageReceive: (message: any) => void;
    onNewMessageNotification?: (message: any) => void;
    onChatHistoryFetch?: (messages: Message[]) => void;
    onPresenceUpdate?: (users: { [key: string]: boolean }) => void; 
  }
  export const useSocket = ({   
    token, 
    senderId, 
    receiverId, 
    onMessageReceive,
    onNewMessageNotification,
    onChatHistoryFetch,
    onPresenceUpdate
  }: UseSocketProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
    const [onlineStatus, setOnlineStatus] = useState<{[key: string]: boolean}>({});
    const [messageReadStatus, setMessageReadStatus] = useState<{[key: string]: boolean}>({});
    const socketRef = useRef<Socket | null>(null);
    const fetchChatHistory = useCallback(() => {
      if (socket && receiverId) {
        socket.emit('fetch_chat_history', receiverId, (response: any) => {
          if (response.success) {
            const formattedMessages = response.messages.map((msg: any) => ({
              id: msg._id,
              text: msg.content,
              sender: msg.currentUserType,
              timestamp: new Date(msg.timestamp).getTime(),
              isRead: msg.isRead,
              status: "sent"
            }));
  
            if (onChatHistoryFetch) {
              onChatHistoryFetch(formattedMessages);
            }
          } else {
            console.error('Failed to fetch chat history:', response.error);
          }
        });
      }
    }, [socket, receiverId, senderId, onChatHistoryFetch]);
    const markMessagesAsRead = useCallback(() => {
      if (socket && receiverId) {
        socket.emit('mark_messages_read', receiverId);
      }
    }, [socket, receiverId]); 
    useEffect(() => {
      if (!token || !senderId || !receiverId) return;
  
      const newSocket = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket', 'polling']
      });
      socketRef.current = newSocket;
      newSocket.on('connect', () => {
        const roomId = [senderId, receiverId].sort().join('_');
        newSocket.emit('join_chat', receiverId);
        setCurrentRoomId(roomId);
        setIsConnected(true);
  
        fetchChatHistory();
      });

      newSocket.on('messages_read', (data: { readBy: string, timestamp: Date }) => {
        setMessageReadStatus(prev => ({
          ...prev,
          [data.readBy]: true
        }));
        
        if (onMessageReceive) {
          onMessageReceive({
            type: 'read_status_update',
            readBy: data.readBy,
            timestamp: data.timestamp
          });
        }
      });

      newSocket.on('presence_update', ({ roomId, users }) => {
        setOnlineStatus(prev => ({
          ...prev,
          ...users
        }));
        if (onPresenceUpdate) {
          onPresenceUpdate(users);
        }
      });
      newSocket.on('receive_message', (message) => {
        onMessageReceive(message);
        if (onNewMessageNotification) {
          onNewMessageNotification(message);
        }
      });
      setSocket(newSocket);
      return () => {
        if (receiverId) {
          newSocket.emit('leave_chat', receiverId);
        }
        newSocket.disconnect();
      };
    }, [token, senderId, receiverId]);
  
    const sendMessage = useCallback((messageData: any) => {
      if (socket && socket.connected && currentRoomId) {
        socket.emit('send_message', {
          ...messageData,
          roomId: currentRoomId,
          timestamp: new Date()
        });
      } else {
        throw new Error('Socket not connected or no room created');
      }
    }, [socket, currentRoomId]);

    const markMessageAsRead = useCallback((messageId: string) => {
      if (socket && receiverId) {
        socket.emit('message_seen', {
          messageIds: [messageId],
          senderId,
          receiverId
        });
      }
    }, [socket, senderId, receiverId]);
  
    return { 
      sendMessage, 
      isConnected,
      fetchChatHistory,
      markMessagesAsRead,
      markMessageAsRead,
      messageReadStatus,
      onlineStatus
    };
  };
  