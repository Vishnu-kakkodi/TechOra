import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Languages, Menu, User, X, Bell, BookOpen, GraduationCap } from 'lucide-react';
import LogoutButton from '../buttons/LogoutButton';
import { useAppSelector } from '../../store/hook';
import { useNotificationQuery, useNotificationReadMutation } from '../../store/slices/userSlice';
import { useNotificationSocket } from '../../useNotificationHook';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [notificationRead] = useNotificationReadMutation();


  const userdata = useAppSelector((state) => state.auth.userInfo);

  const { data: notification, refetch } = useNotificationQuery(null);
  const userDepartment = userdata?.department || 'general';


  const { isConnected } = useNotificationSocket({
    token: userdata?.accessToken,
    senderId: userdata?._id,
    department: userDepartment,
    onNotification: (notification) => {
      handleNewNotification(notification);
    }
  });

  useEffect(() => {
    if (notification?.data) {
      setNotifications(notification.data);
    }
  }, [notification]);


  const handleNewNotification = (notification: any) => {
    setNotifications((prev:any) => {
      const exists = prev.some((n:any) => n._id === notification._id);
      if (exists) return prev;
      const updated = [notification, ...prev];
      // toast.success(notification.title, {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      // });
      return updated;
    });
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    setNotifications(notifications.map((notif:any) =>
      notif._id === notificationId ? { ...notif, readBy: [...(notif.readBy || []), userdata?._id] } : notif
    ));
  };


  const [notifications, setNotifications] = useState(notification?.data || []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id: any) => {
    setNotifications(notifications.map((notif: any) =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleRead = async (notificationId:string) => {
    try{
      const response = await notificationRead(notificationId);
      refetch()
    }catch(error){
      console.log(error)
    }
  }

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <header className="w-full top-0 shadow-lg bg-white relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl md:text-[35px] text-black font-bold tracking-tight leading-tight">
                TechOra
              </span>
              <span className="text-[8px] md:text-[10px] text-black/80 -mt-1 ml-1">
                Let's Build Your Future
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-gray-800 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-100"
              >
                {item}
              </Link>
            ))}

            <div className="flex items-center space-x-4">

              <LogoutButton />

              <button
                className="border-2 border-black p-2 rounded-md hover:bg-yellow-400 transition-colors"
                onClick={() => setLanguageModalOpen(true)}
                aria-label="Change Language"
              >
                <Languages className="w-5 h-5" />
              </button>

              {userdata?.profilePhoto && (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={userdata.profilePhoto}
                    alt={userdata.userName || 'User profile'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-gray-600 hover:text-yellow-400 hover:bg-gray-100 rounded-md transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="fixed right-4 top-16 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-[calc(100vh-5rem)] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notification: any, index: any) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                            } ${index !== notifications.length - 1 ? 'border-b border-gray-200' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start">
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification?.type}
                              </p>
                              <p className="text-sm text-gray-500">
                                {notification?.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification?.createdAt}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <X />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}
            </div> */}

            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-gray-600 hover:text-yellow-400 hover:bg-gray-100 rounded-md transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="fixed right-4 top-16 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-[calc(100vh-5rem)] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notification:any) => (
                        <div
                          key={notification._id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.readBy?.includes(userdata?._id) ? 'bg-blue-50' : ''
                            } border-b border-gray-200`}
                          onClick={() => handleMarkAsRead(notification._id)}
                        >
                          <div className="flex items-start">
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.type}
                              </p>
                              <p className="text-sm text-gray-500">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <X onClick={()=>handleRead(notification._id)}/>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-yellow-400 hover:bg-gray-100 transition"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
  <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
    <div
      className="absolute top-0 left-0 w-1/2 h-full bg-white p-4"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold">Menu</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-600 hover:text-yellow-400"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="space-y-4">
        {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className="block px-4 py-2 rounded-md text-base bg-red-100 font-medium border-2 text-gray-800 hover:bg-red-400"
            onClick={() => setIsOpen(false)} 
          >
            {item}
          </Link>
        ))}
      </nav>
    </div>
  </div>
)}

    </header>
  );
};

export default Navbar;