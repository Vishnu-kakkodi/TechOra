import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, User, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'file';
}

const ChatSession: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'John Doe', 
      avatar: 'https://via.placeholder.com/50', 
      lastMessage: 'Hello, I need help with my course',
      unreadCount: 2 
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      avatar: 'https://via.placeholder.com/50', 
      lastMessage: 'Can we discuss the quiz?',
      unreadCount: 1 
    }
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = (userId: string) => {
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: userId,
        senderName: selectedUser?.name || 'User',
        content: 'Hello, I need help with my course assignment',
        timestamp: Date.now() - 300000,
        type: 'text'
      },
      {
        id: '2',
        senderId: 'tutor',
        senderName: 'Tutor',
        content: 'Sure, what specific help do you need?',
        timestamp: Date.now() - 250000,
        type: 'text'
      }
    ];
    setMessages(mockMessages);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    fetchMessages(user.id);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'tutor',
      senderName: 'Tutor',
      content: newMessage,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    toast.success('Message sent successfully');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.info(`File ${file.name} selected for upload`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Chat Sessions</h2>
        </div>
        {users.map(user => (
          <div 
            key={user.id}
            onClick={() => handleUserSelect(user)}
            className={`
              flex items-center p-4 cursor-pointer hover:bg-gray-100 
              ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}
            `}
          >
            <div className="relative">
              <img 
                src={user.avatar || 'https://via.placeholder.com/50'}
                alt={user.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              {user.unreadCount && user.unreadCount > 0 ? (
                <span className="absolute top-0 right-3 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {user.unreadCount}
                </span>
              ) : null}
            </div>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-gray-500 text-sm truncate">
                {user.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-white p-4 flex items-center justify-between border-b">
              <div className="flex items-center">
                <img 
                  src={selectedUser.avatar || 'https://via.placeholder.com/50'}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h2 className="font-semibold">{selectedUser.name}</h2>
                  <p className="text-gray-500 text-sm">Active now</p>
                </div>
              </div>
              <div>
                <button className="text-gray-500 hover:text-blue-600">
                  <Lock className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`flex ${
                    message.senderId === 'tutor' 
                      ? 'justify-end' 
                      : 'justify-start'
                  }`}
                >
                  <div 
                    className={`
                      max-w-md p-3 rounded-lg 
                      ${
                        message.senderId === 'tutor' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-black'
                      }
                    `}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-70 block text-right mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white p-4 border-t flex items-center">
              <input 
                type="file" 
                className="hidden" 
                id="file-upload"
                onChange={handleFileUpload}
              />
              <label 
                htmlFor="file-upload" 
                className="mr-4 cursor-pointer text-gray-500 hover:text-blue-600"
              >
                <Paperclip className="w-6 h-6" />
              </label>
              <input 
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-2 border rounded-lg mr-4"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSession;