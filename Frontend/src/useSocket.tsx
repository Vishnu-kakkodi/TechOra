
  import { useState, useEffect, useCallback, useRef } from 'react';
  import io, { Socket } from 'socket.io-client';
  
  interface Message {
    id: string; 
    text: string;
    sender: "user" | "tutor";
    timestamp: number;
    status?: "sending" | "sent" | "failed";
  }
  
  interface UseSocketProps {
    token?: string;
    senderId?: string;
    receiverId?: string | null;
    onMessageReceive: (message: any) => void;
    onNewMessageNotification?: (message: any) => void;
    onChatHistoryFetch?: (messages: Message[]) => void;
  }
  
  export const useSocket = ({   
    token, 
    senderId, 
    receiverId, 
    onMessageReceive,
    onNewMessageNotification,
    onChatHistoryFetch
  }: UseSocketProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
  
    // Memoized function for fetching chat history
    const fetchChatHistory = useCallback(() => {
      if (socket && receiverId) {
        socket.emit('fetch_chat_history', receiverId, (response: any) => {
          if (response.success) {
            const formattedMessages = response.messages.map((msg: any) => ({
              id: msg._id,
              text: msg.content,
              sender: msg.currentUserType,
              timestamp: new Date(msg.timestamp).getTime(),
              status: "sent"
            }));
  
            // Call the callback if provided
            if (onChatHistoryFetch) {
              onChatHistoryFetch(formattedMessages);
            }
          } else {
            console.error('Failed to fetch chat history:', response.error);
          }
        });
      }
    }, [socket, receiverId, senderId, onChatHistoryFetch]);
  
    // Handle socket connection and fetch chat history on initial render
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
  
        // Fetch chat history only once after connection
        fetchChatHistory();
      });
  
      newSocket.on('receive_message', (message) => {
        onMessageReceive(message);
        if (onNewMessageNotification) {
          onNewMessageNotification(message);
        }
      });
  
      setSocket(newSocket);
  
      return () => {
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
  
    return { 
      sendMessage, 
      isConnected,
      fetchChatHistory
    };
  };
  