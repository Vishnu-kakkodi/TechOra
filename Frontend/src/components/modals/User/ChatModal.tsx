import React, { useState, useEffect, useCallback, useRef } from "react";
import { Send, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../../../useSocket";
import notificationSound from "../../../assets/frontEnd/notification_sound.mp3";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";


interface Message {
  id: string;
  text: string;
  sender: "user" | "tutor";
  timestamp: number;
  status?: "sending" | "sent" | "failed";
  isRead?: boolean;
}


interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string;
  senderId?: string;
  receiverId?: string | null;
  receiverName?: string;
  receiverProfilePhoto?: string;
  currentUserType: "user" | "tutor";
  sendDataToParent: (data: { message: string; timestamp: number;}) => void;

}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  token,
  senderId,
  receiverId,
  receiverName,
  receiverProfilePhoto,
  currentUserType,
  sendDataToParent
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isFetchingOlderMessages, setIsFetchingOlderMessages] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const handlePresenceUpdate = useCallback((users: { [key: string]: boolean }) => {
    if (receiverId && users[receiverId] !== undefined) {
      setIsOnline(users[receiverId]);
    }
  }, [receiverId]);

  const handleNotification = useCallback((message: any) => {
    new Notification("New Message", {
      body: message.text,
    });
    const audio = new Audio(notificationSound);
    audio.play();
  }, []);

  const { sendMessage, isConnected, fetchChatHistory, markMessagesAsRead, markMessageAsRead, messageReadStatus, onlineStatus } = useSocket({
    token,
    senderId,
    receiverId,
    onNewMessageNotification: handleNotification,
    onMessageReceive: (receivedData) => {
      if (receivedData.type === 'read_status_update') {
        setMessages(prev => prev.map(msg => 
          msg.sender === currentUserType ? { ...msg, isRead: true } : msg
        ));
      } else {
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === receivedData.id);
          const newMessage = {
            ...receivedData,
            isRead: false 
          };
          return exists ? prev : [...prev, newMessage];
        });

        if (isOpen && receivedData.sender !== currentUserType) {
          markMessageAsRead(receivedData.id);
        }
      }
    },
    onChatHistoryFetch: (fetchedMessages) => {
      setMessages(fetchedMessages);
    },
    onPresenceUpdate: handlePresenceUpdate
  });

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const unreadMessages = messages.filter(
        msg => !msg.isRead && msg.sender !== currentUserType
      );
      
      if (unreadMessages.length > 0) {
        unreadMessages.forEach(msg => markMessageAsRead(msg.id));
      }
    }
  }, [isOpen, messages, currentUserType, markMessageAsRead]);

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen, fetchChatHistory]);

  useEffect(() => {
    if (receiverId && onlineStatus[receiverId] !== undefined) {
      setIsOnline(onlineStatus[receiverId]);
    }
  }, [receiverId, onlineStatus]);

  const fetchOlderMessages = useCallback(async () => {
    setIsFetchingOlderMessages(true);
    try {
      const olderMessages: Message[] = await new Promise((resolve) =>
        setTimeout(() =>
          resolve([{
            id: `msg_${Date.now() - 10000}`,
            text: "This is an older message",
            sender: currentUserType,
            timestamp: Date.now() - 10000,
            status: "sent",
            isRead: true
          }]), 1000
        )
      );
      setMessages((prev) => [...olderMessages, ...prev]);
    } catch (error) {
      console.error("Failed to fetch older messages", error);
    } finally {
      setIsFetchingOlderMessages(false);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (chatContainerRef.current && chatContainerRef.current.scrollTop === 0) {
      fetchOlderMessages();
      markMessagesAsRead();
    }
  }, [fetchOlderMessages, markMessagesAsRead]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || !isConnected || !senderId || !receiverId) return;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: trimmedMessage,
      sender: currentUserType,
      timestamp: Date.now(),
      status: "sending",
      isRead: isOnline ? true : false
    };

    setMessages((prev) => [...prev, message]);

    try {
      sendMessage({
        ...message,
        senderId,
        receiverId,
      });
      sendDataToParent({
        message: trimmedMessage,
        timestamp: message.timestamp
      });
      setNewMessage("");
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "failed" } : msg
        )
      );
      console.error("Failed to send message", error);
    }
  };

  const retryMessage = (messageId: string) => {
    const failedMessage = messages.find((msg) => msg.id === messageId);
    if (failedMessage && senderId && receiverId) {
      sendMessage({
        ...failedMessage,
        senderId,
        receiverId,
        status: "sending",
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "sending" } : msg
        )
      );
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setIsEmojiPickerVisible(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-24 right-6 w-96 rounded-2xl shadow-2xl border-2 border-white/50 overflow-hidden z-50 ${isDarkTheme ? "bg-gray-900 text-gray-200" : "bg-gradient-to-br from-indigo-50 to-purple-100"
            }`}
        >
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src={receiverProfilePhoto}
                alt="Receiver Profile"
                className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
              />
              <div>
                <h3 className="font-bold text-lg drop-shadow-md">{receiverName}</h3>
                <span
                  className={`text-sm ${isOnline ? "text-green-300" : "text-red-300"
                    } drop-shadow-sm`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-all duration-300 transform hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>


          <div
            ref={chatContainerRef}
            className="h-96 overflow-y-auto p-4 space-y-4 bg-white/40 backdrop-blur-sm"
            style={{
              backgroundImage:
                "linear-gradient(to bottom right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            {isFetchingOlderMessages && (
              <div className="text-center text-gray-500 text-sm mb-2">
                Loading older messages...
              </div>
            )}

            {messages.map((message) => {
              const isSender = (message.sender === currentUserType);
              const messageTime = new Date(message.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div
                    className={`relative max-w-[80%] px-4 py-2 rounded-xl shadow-md ${isSender
                      ? "bg-gradient-to-br from-green-500 to-green-400 text-white"
                      : "bg-gray-200 text-gray-800"
                      } ${message.status === "failed" ? "border-2 border-red-500" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm">{message.text}</p>
                      <div className="ml-2 flex items-center text-xs space-x-1 relative">
                        <span className={`${isSender ? "text-gray-200" : "text-black"}`}>{messageTime}</span>
                        {isSender && (
                          <span
                            className={`flex items-center font-bold text-xs ${message.isRead ? "text-blue-500" : "text-black-500"
                              }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5" 
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path
                                d="M20.285 6.705a1 1 0 010 1.41l-11 11a1 1 0 01-1.41 0l-5-5a1 1 0 011.41-1.41l4.3 4.29 10.29-10.29a1 1 0 011.41 0z"
                              />
                            </svg>
                          </span>

                        )}
                      </div>
                    </div>

                    {message.status === "failed" && isSender && (
                      <button
                        onClick={() => retryMessage(message.id)}
                        className="absolute -bottom-6 right-0 text-red-500 text-xs hover:text-red-700"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </motion.div>
              );


            })}

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white/30 backdrop-blur-sm"
          >
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
                className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                😊
              </button>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={!isConnected}
                  className="w-full p-3 pl-10 pr-10 bg-white/70 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={!isConnected || !newMessage.trim()}
                className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>

            {!isConnected && (
              <p className="text-red-500 text-xs mt-2">
                Disconnected. Please check your connection.
              </p>
            )}
          </form>

          {isEmojiPickerVisible && (
            <div className="absolute bottom-16 left-4 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;







