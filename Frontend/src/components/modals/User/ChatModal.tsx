import React, { useState, useEffect, useCallback, useRef } from "react";
import { Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../../../useSocket";
import notificationSound from "../../../assets/frontEnd/notification_sound.mp3";
import { toast } from "react-toastify";

/**
 * Message Interface
 */
interface Message {
  id: string;
  text: string;
  sender: "user" | "tutor";
  timestamp: number;
  status?: "sending" | "sent" | "failed";
}

/**
 * ChatModal Component Props
 */
interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string;
  senderId?: string;
  receiverId?: string | null;
  currentUserType: "user" | "tutor";
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  token,
  senderId,
  receiverId,
  currentUserType,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isFetchingOlderMessages, setIsFetchingOlderMessages] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const handleNotification = useCallback((message: any) => {
    new Notification("New Message", {
      body: message.text,
    });
    toast.success(message.text);
    const audio = new Audio(notificationSound);
    audio.play();
  }, []);

  const { sendMessage, isConnected, fetchChatHistory } = useSocket({
    token,
    senderId,
    receiverId,
    onNewMessageNotification: handleNotification,
    onMessageReceive: (receivedMessage: Message) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === receivedMessage.id);
        return exists ? prev : [...prev, receivedMessage];
      });
    },
    onChatHistoryFetch: (fetchedMessages) => {
      setMessages(fetchedMessages);
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen, fetchChatHistory]);

  const fetchOlderMessages = useCallback(async () => {
    setIsFetchingOlderMessages(true);
    try {
      // Simulate an API call for older messages
      const olderMessages: Message[] = await new Promise((resolve) =>
        setTimeout(() =>
          resolve([
            {
              id: `msg_${Date.now() - 10000}`,
              text: "This is an older message",
              sender: currentUserType,
              timestamp: Date.now() - 10000,
              status: "sent",
            },
          ]),
          1000
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
    }
  }, [fetchOlderMessages]);

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
    };

    setMessages((prev) => [...prev, message]);

    try {
      sendMessage({
        ...message,
        senderId,
        receiverId,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-24 right-6 w-96 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl shadow-2xl border-2 border-white/50 overflow-hidden z-50"
        >
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg drop-shadow-md">Live Chat Support</h3>
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
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-[80%] p-3 rounded-2xl shadow-lg ${isSender
                        ? "bg-gradient-to-br from-blue-600 to-purple-700 text-white"
                        : "bg-gray-100 text-gray-800"
                      } ${message.status === "failed" ? "border-2 border-red-500" : ""}`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs text-gray-400 mt-1 block text-right">
                      {messageTime}
                    </span>
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
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={!isConnected}
                className="flex-1 p-3 bg-white/70 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50"
              />
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
