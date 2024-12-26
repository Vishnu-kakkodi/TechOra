
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Languages, Menu, User, X } from 'lucide-react';
// import LogoutButton from '../buttons/LogoutButton';
// import SearchBar from '../search/SearchBar';
// import { useAppSelector } from '../../store/hook';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const searchData = ['Course', 'Quiz'];
//   const [selectedLanguage, setSelectedLanguage] = useState('en');
//   const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);

//   const userdata = useAppSelector((state) => state.auth.userInfo);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (

//     <header className="w-full top-0 shadow-lg bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-4">
//             <Link to="/" className="flex flex-col">
//               <span className="text-2xl md:text-[35px] text-black font-bold tracking-tight leading-tight">
//                 TechOra
//               </span>
//               <span className="text-[8px] md:text-[10px] text-black/80 -mt-1 ml-1">
//                 Let's Build Your Future
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
//               <Link
//                 key={item}
//                 to={`/${item.toLowerCase()}`}
//                 className="text-gray-800 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-100"
//               >
//                 {item}
//               </Link>
//             ))}

//             {/* Buttons and Language Selector */}
//             <div className="flex items-center space-x-4">
//               <LogoutButton/>
//               <button
//                 className="p-2 rounded-md hover:bg-gray-100 transition-colors"
//                 aria-label="Logout"
//               >
//               </button>

//               <button
//                 className="border-2 border-black p-2 rounded-md hover:bg-yellow-400 transition-colors"
//                 onClick={() => setLanguageModalOpen(true)}
//                 aria-label="Change Language"
//               >
//                 <Languages className="w-5 h-5" />
//               </button>

//               {userdata?.profilePhoto && (
//                 <div className="w-10 h-10 rounded-full overflow-hidden">
//                   <img
//                     src={userdata.profilePhoto}
//                     alt={userdata.userName || 'User profile'}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               )}
//             </div>
//           </nav>

//           {/* Mobile Menu */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={toggleMenu}
//               className="p-2 rounded-md text-gray-600 hover:text-yellow-400 hover:bg-gray-100 transition"
//             >
//               {isOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
//               <Link
//                 key={item}
//                 to={`/${item.toLowerCase()}`}
//                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
//               >
//                 {item}
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Languages, Menu, User, X, Bell, BookOpen, GraduationCap } from 'lucide-react';
import LogoutButton from '../buttons/LogoutButton';
import SearchBar from '../search/SearchBar';
import { useAppSelector } from '../../store/hook';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchData = ['Course', 'Quiz'];
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'course',
      title: 'New Course: Advanced Mathematics',
      message: 'Prof. Smith just added a new course on Calculus',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'quiz',
      title: 'New Quiz Available',
      message: 'Complete the Python Basics quiz before Friday',
      time: '1 hour ago',
      read: false
    }
  ]);

  const userdata = useAppSelector((state) => state.auth.userInfo);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id:any) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="w-full top-0 shadow-lg bg-white relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
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

              <LogoutButton/>

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
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                {notification.type === 'course' ? (
                                  <BookOpen className="w-5 h-5 text-blue-500" />
                                ) : (
                                  <GraduationCap className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.time}
                                </p>
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;