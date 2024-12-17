import React, { useEffect, useState } from 'react';
import { Send, MessageCircle, User as UserIcon, Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import ChatModal from '../../components/modals/User/ChatModal';
import { useAppSelector } from '../../store/hook';
import useDebouncedValue from '../../hooks/debounceHook';
import { useEnrolledUsersQuery } from '../../store/slices/tutorSlice';
import { User } from '../../types/userTypes';

interface Message {
  id: string;
  senderId: string | null;
  senderName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'file';
}


const UserChatList: React.FC = () => {
  const tutordata = useAppSelector((state) => state.auth.tutorInfo);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
    const [search, setSearch] = useState("");
    const debouncedSearchTerm = useDebouncedValue(search, 500);

      const {
        data: Data,
        isLoading,
        isError
      } = useEnrolledUsersQuery({
        page,
        limit,
        search: debouncedSearchTerm
      });

    const users = Data?.users || [];
    const total = Data?.total || users.length;;


  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleOpenChatModal = (user: User) => {
    setSelectedUser(user._id); 
    setIsChatOpen(true);
  
    const initialMessages: Message[] = [
      {
        id: '1',
        senderId: user._id,
        senderName: user.userName,
        content: 'Hello, I need help with my course assignment',
        timestamp: Date.now() - 300000,
        type: 'text',
      },
    ];
    setMessages(initialMessages);
  };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setPage(1);
      setSearch(value);
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

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };


  return (
    <div className='flex'>
      <TutorSidebar/>
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Student Chat List</h1>
      <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4">Search</h2>
                  <div className="w-[300px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={search}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
      
      <div className="grid gap-4">
        {users.map((user:any) => (
          <div 
            key={user.id} 
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <img 
                src={user.profilePhoto}
                alt={user.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="font-semibold text-lg">{user.userName}</h2>
                <p className="text-gray-500">{user.email}</p>
                {user.lastMessage && (
                  <p className="text-sm text-gray-400 mt-1">
                    {user.lastMessage}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {user.unreadCount && user.unreadCount > 0 ? (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs mr-4">
                  {user.unreadCount} new
                </span>
              ) : null}
              <button 
                onClick={() => handleOpenChatModal(user)}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat
              </button>
            </div>
          </div>
        ))}
                  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page * limit >= total}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(page - 1) * limit + 1}</span>{' '}
                  to{' '}
                  <span className="font-medium">{Math.min(page * limit, total)}</span>{' '}
                  of{' '}
                  <span className="font-medium">{total}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    {page}
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page * limit >= total}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
      </div>

      <ChatModal
                  isOpen={isChatOpen}
                  onClose={() => setIsChatOpen(false)}
                  token={tutordata?.accessToken}
                  senderId={tutordata?._id}
                  receiverId={(selectedUser)}
                  currentUserType='tutor'
                />    
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
    </div>
  );
};

export default UserChatList;