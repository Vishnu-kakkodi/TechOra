// import { useState, useEffect, useCallback } from 'react';
// import io, { Socket } from 'socket.io-client';

// interface NotificationSocketProps {
//   token?: string;
//   userId?: string;
//   onNotification?: (notification: any) => void;
// }

// export const useNotificationSocket = ({
//   token,
//   userId,
//   onNotification
// }: NotificationSocketProps) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     if (!token || !userId) return;

//     const newSocket = io('http://localhost:5000', {
//       auth: { token },
//       transports: ['websocket', 'polling'],
//       withCredentials: true
//     });

//     newSocket.on('connect', () => {
//       setIsConnected(true);
//       newSocket.emit('join_notification_room', userId);
//     });

//     newSocket.on('notification', (notification) => {
//       if (onNotification) {
//         onNotification(notification);
//       }
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [token, userId, onNotification]);

//   const sendNotification = useCallback((notificationData: any) => {
//     if (socket && socket.connected) {
//       socket.emit('create_notification', notificationData);
//     } else {
//       throw new Error('Notification socket not connected');
//     }
//   }, [socket]);

//   return {
//     sendNotification,
//     isConnected
//   };
// };




// import { useState, useEffect, useCallback } from 'react';
// import io, { Socket } from 'socket.io-client';

// interface NotificationSocketProps {
//   token?: string;
//   userId?: string;
//   onNotification?: (notification: any) => void;
// }

// export const useNotificationSocket = ({
//   token,
//   userId,
//   onNotification
// }: NotificationSocketProps) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     if (!token) {
//       console.log('Missing token');
//       return;
//     }

//     const newSocket = io('http://localhost:5000', {
//       auth: { token },
//       transports: ['websocket'],
//       withCredentials: true,
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000
//     });

//     newSocket.on('connect', () => {
//       console.log('Socket connected successfully');
//       setIsConnected(true);
//     });

//     newSocket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       setIsConnected(false);
//     });

//     newSocket.on('notification', (notification) => {
//       console.log('Received notification:', notification);
//       if (onNotification) {
//         onNotification(notification);
//       }
//     });

//     newSocket.on('notification_error', (error) => {
//       console.error('Notification error:', error);
//     });

//     setSocket(newSocket);

//     return () => {
//       if (newSocket) {
//         newSocket.disconnect();
//       }
//     };
//   }, [token, onNotification]);

//   const sendNotification = useCallback((notificationData: any) => {
//     if (!socket) {
//       console.error('Socket not initialized');
//       return;
//     }

//     if (!isConnected) {
//       console.error('Socket not connected');
//       return;
//     }

//     console.log('Sending notification:', notificationData);
//     socket.emit('create_notification', notificationData);
//   }, [socket, isConnected]);

//   return {
//     sendNotification,
//     isConnected
//   };
// };




// import { useState, useEffect, useCallback } from 'react';
// import io, { Socket } from 'socket.io-client';

// interface NotificationSocketProps {
//   token?: string;
//   senderId?: string;
//   onNotification?: (notification: any) => void;
// }

// export const useNotificationSocket = ({
//   token,
//   senderId,
//   onNotification
// }: NotificationSocketProps) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [connectionError, setConnectionError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!token) {
//       setConnectionError('Missing authentication token');
//       return;
//     }

//     if (!senderId) {
//       setConnectionError('Missing user ID');
//       return;
//     }

//     console.log('Initializing socket connection...');

//     const newSocket = io('http://localhost:5000', {
//       auth: { token },
//       transports: ['websocket'],
//       withCredentials: true,
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       timeout: 10000
//     });

//     newSocket.on('connect', () => {
//       console.log('Socket connected successfully');
//       setIsConnected(true);
//       setConnectionError(null);
//     });

//     newSocket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       setIsConnected(false);
//       setConnectionError(error.message);
//     });

//     newSocket.on('notification', (notification) => {
//       console.log('Received notification:', notification);
//       onNotification?.(notification);
//     });

//     newSocket.on('notification_error', (error) => {
//       console.error('Notification error:', error);
//     });

//     newSocket.on('notification_created', (response) => {
//       console.log('Notification created successfully:', response);
//     });

//     newSocket.on('disconnect', (reason) => {
//       console.log('Socket disconnected:', reason);
//       setIsConnected(false);
//     });

//     setSocket(newSocket);

//     return () => {
//       console.log('Cleaning up socket connection...');
//       if (newSocket) {
//         newSocket.disconnect();
//       }
//     };
//   }, [token, senderId, onNotification]);

//   const sendNotification = useCallback((notificationData: any) => {
//     if (!socket) {
//       throw new Error('Socket not initialized');
//     }

//     if (!isConnected) {
//       throw new Error('Socket not connected');
//     }

//     console.log('Sending notification:', notificationData);
//     socket.emit('create_notification', {
//       ...notificationData,
//       timestamp: new Date().toISOString()
//     });
//   }, [socket, isConnected]);

//   return {
//     sendNotification,
//     isConnected,
//     connectionError
//   };
// };