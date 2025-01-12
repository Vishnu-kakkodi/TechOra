// // import React from 'react';
// // import { Outlet, useNavigate } from 'react-router-dom';
// // import {
// //     User,
// //     Settings,
// //     Wallet,
// //     Lock,
// //     List,
// //     LogOut,
// //     BookOpen,
// //     Heart
// // } from 'lucide-react';
// // import { useAppDispatch, useAppSelector } from '../../store/hook';
// // import { userLogout } from '../../store/slices/authSlice';

// // const UserAccountSidebar: React.FC = () => {
// //     const userdata = useAppSelector((state) => state.auth.userInfo);

// //     const navigate = useNavigate();
// //     const dispatch = useAppDispatch();

// //     const handleNavigate = (path: string) => {
// //         navigate(path);
// //     };

// //     const handleLogout = () => {
// //         dispatch(userLogout());
// //         navigate('/login');
// //     };

// //     return (
// //             <div className="h-[600px] w-[400px] bg-gray-900 shadow-lg m-5 ">
// //                 <div className="p-6">
// //                     <div className="mb-8 text-center">
// //                         <div className='flex justify-center items-center space-x-[30px]'>
// //                             <img
// //                                 className='bg-white w-[50px] h-[50px] rounded-full object-cover'
// //                                 src={userdata?.profilePhoto}
// //                                 alt="profile"
// //                             />
// //                             <h2 className="text-xl font-semibold text-white">{userdata?.userName}</h2>
// //                         </div>
// //                     </div>

// //                     <div className="space-y-6">
// //                         <div className="space-y-2">
// //                             <button
// //                                 onClick={() => handleNavigate('/account')}
// //                                 className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full"
// //                             >
// //                                 <User className="w-5 h-5" />
// //                                 <span>Personal Information</span>
// //                             </button>
// //                         </div>

// //                         <div className="space-y-2">
// //                             <button
// //                                 onClick={() => handleNavigate('/account/change-password')}
// //                                 className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full"
// //                             >
// //                                 <Lock className="w-5 h-5" />
// //                                 <span>Change Password</span>
// //                             </button>
// //                         </div>

// //                         <div className="space-y-2">
// //                             <button
// //                                 onClick={() => handleNavigate('/account/orders')}
// //                                 className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full"
// //                             >
// //                                 <List className="w-5 h-5" />
// //                                 <span>Order List</span>
// //                             </button>
// //                         </div>

// //                         <div className="space-y-2">
// //                             <button
// //                                 onClick={() => handleNavigate('/account/my-courses')}
// //                                 className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full"
// //                             >
// //                                 <BookOpen className="w-5 h-5" />
// //                                 <span>Course List</span>
// //                             </button>
// //                             <button
// //                                 onClick={() => handleNavigate('/account/favourate')}
// //                                 className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full"
// //                             >
// //                                 <Heart className="w-5 h-5" />
// //                                 <span>Favourate Course</span>
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //     );
// // };

// // export default UserAccountSidebar;


// import React, { useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import {
//     User,
//     Settings,
//     Wallet,
//     Lock,
//     List,
//     LogOut,
//     BookOpen,
//     Heart
// } from 'lucide-react';
// import { useAppDispatch, useAppSelector } from '../../store/hook';
// import { userLogout } from '../../store/slices/authSlice';

// const UserAccountSidebar = () => {
//     const userdata = useAppSelector((state) => state.auth.userInfo);
//     const navigate = useNavigate();
//     const dispatch = useAppDispatch();

//     const handleNavigate = (path: string) => {
//         navigate(path);
//     };

//     const handleLogout = () => {
//         dispatch(userLogout());
//         navigate('/login');
//     };

//     const menuItems = [
//         { icon: <User className="w-5 h-5" />, text: 'Personal Information', path: '/account' },
//         { icon: <Lock className="w-5 h-5" />, text: 'Change Password', path: '/account/change-password' },
//         { icon: <List className="w-5 h-5" />, text: 'Order List', path: '/account/orders' },
//         { icon: <BookOpen className="w-5 h-5" />, text: 'Course List', path: '/account/my-courses' },
//         { icon: <Heart className="w-5 h-5" />, text: 'Favourite Course', path: '/account/favourate' }
//     ];

//     return (
//         <div className="h-full min-h-[600px] bg-gray-900 shadow-lg transition-all duration-300
//              sm:w-64 lg:w-[400px]">
//             <div className="p-4 lg:p-6">
//                 {/* Profile Section */}
//                 <div className="hidden sm:block mb-8 text-center">
//                     <div className="flex justify-center items-center space-x-4 lg:space-x-[30px]">
//                         <img
//                             className="bg-white w-10 h-10 lg:w-[50px] lg:h-[50px] rounded-full object-cover"
//                             src={userdata?.profilePhoto}
//                             alt="profile"
//                         />
//                         <h2 className="hidden sm:block text-xl font-semibold text-white">
//                             {userdata?.userName}
//                         </h2>
//                     </div>
//                 </div>

//                 {/* Menu Items */}
//                 <div className="space-y-6">
//                     {menuItems.map((item, index) => (
//                         <div key={index} className="space-y-2">
//                             <button
//                                 onClick={() => handleNavigate(item.path)}
//                                 className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full
//                                     hover:bg-gray-800 transition-colors"
//                             >
//                                 <div className="min-w-[20px]">{item.icon}</div>
//                                 <span className="hidden sm:block">{item.text}</span>
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserAccountSidebar;

import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User,
    Lock,
    List,
    BookOpen,
    Heart,
    Menu,
    X,
    EllipsisVertical
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { userLogout } from '../../store/slices/authSlice';

const UserAccountSidebar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const userdata = useAppSelector((state) => state.auth.userInfo);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsMenuOpen(false); // Close the menu after navigation
    };

    const handleLogout = () => {
        dispatch(userLogout());
        navigate('/login');
    };

    const menuItems = [
        { icon: <User className="w-6 h-6" />, text: 'Personal Info', path: '/account' },
        { icon: <Lock className="w-6 h-6" />, text: 'Change Password', path: '/account/change-password' },
        { icon: <List className="w-6 h-6" />, text: 'Orders', path: '/account/orders' },
        { icon: <BookOpen className="w-6 h-6" />, text: 'Courses', path: '/account/my-courses' },
        { icon: <Heart className="w-6 h-6" />, text: 'Favourites', path: '/account/favourate' }
    ];

    return (
        <div>
            {/* Menu Toggle Button (Small Screens) */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden fixed top-20 right-2 z-50 bg-gray-900 text-white p-2 rounded-full shadow-md"
            >
                {isMenuOpen ? <X className="w-3 h-3" /> : <EllipsisVertical className="w-3 h-3" />}
            </button>

            {/* Horizontal Menu (Small Screens) */}
            {isMenuOpen && (
                <div className="sm:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white 
                    shadow-lg rounded-lg flex items-center space-x-4 px-4 py-2 z-50">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigate(item.path)}
                            className="flex flex-col items-center space-y-1"
                        >
                            {item.icon}
                            <span className="text-xs">{item.text}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Sidebar (Larger Screens) */}
            <motion.div
                className="hidden sm:block max-h-fit bg-gray-200 shadow-lg transition-all duration-300 sm:w-64 lg:w-[250px] mt-20 ml-20 mr-5 rounded-md"
            >
                <div className="p-4 lg:p-6">
                    <div className="space-y-8 mt-5">
                        {menuItems.map((item, index) => (
                            <div key={index} className="space-y-2 bg-gray-900 rounded-md overflow-hidden">
                                <motion.button
                                    onClick={() => handleNavigate(item.path)}
                                    className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full
                  hover:bg-gray-800 transition-colors"
                                    whileHover={{
                                        x: 10,
                                        transition: { type: "spring", stiffness: 300 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="min-w-[20px]"
                                        whileHover={{ rotate: 5 }}
                                    >
                                        {item.icon}
                                    </motion.div>
                                    <span>{item.text}</span>
                                </motion.button>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserAccountSidebar;
