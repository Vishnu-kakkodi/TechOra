import { useState, useEffect, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface NotificationSocketProps {
  token?: string;
  senderId?: string;
  department?: string;
  onNotification?: (notification: any) => void;
}

export const useNotificationSocket = ({
    token,
    senderId,
    department = 'general',
    onNotification
  }: NotificationSocketProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  
    useEffect(() => {
      if (!token) {
        setConnectionError('Missing authentication token');
        return;
      }

      if (!senderId) {
        setConnectionError('Missing user ID');
        return;
      }
      console.log('Initializing socket connection...');
  
      const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        auth: { token },
        transports: ['websocket', 'polling']
      });
  
      const handleReconnect = () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect socket...');
          newSocket.connect();
        }, 2000);
      };
  
      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
        setIsConnected(true);
        setConnectionError(null);
        newSocket.emit('subscribe_notifications', department);
      });

      newSocket.on('new_notification', (notification) => {
        if (onNotification) {
          onNotification(notification);
        }
      });

      newSocket.on('unread_notifications', (notifications) => {
        if (onNotification) {
          notifications.forEach((notification: any) => {
            onNotification(notification);
          });
        }
      });
  
  
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
        setConnectionError(error.message);
        handleReconnect();
      });
  
      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          handleReconnect();
        }
      });
  
      setSocket(newSocket);
  
      return () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }, [token, senderId]);
  
    const sendNotification = useCallback((notificationData: any) => {
      if (!socket) {
        throw new Error('Socket not initialized');
      }
  
      if (!isConnected) {
        throw new Error('Socket not connected');
      }
  
      console.log('Sending notification:', notificationData);
      socket.emit('create_notification', {
        ...notificationData,
        timestamp: new Date().toISOString()
      });
    }, [socket, isConnected]);

    const markAsRead = useCallback((notificationId: string) => {
      if (!socket?.connected) return;
      socket.emit('mark_notification_read', notificationId);
    }, [socket]);
  
    return {
      sendNotification,
      markAsRead,     
      isConnected,
      connectionError
    };
  };