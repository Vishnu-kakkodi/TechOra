import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    User,
    Settings,
    Wallet,
    Lock,
    List,
    LogOut,
    BookOpen
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { userLogout } from '../../store/slices/authSlice';

const UserAccountSidebar: React.FC = () => {
    const userdata = useAppSelector((state) => state.auth.userInfo);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        dispatch(userLogout());
        navigate('/login');
    };

    return (
            <div className="h-screen w-[400px] bg-gray-900 shadow-lg">
                <div className="p-6">
                    <div className="mb-8 text-center">
                        <div className='flex justify-center items-center space-x-[30px]'>
                            <img
                                className='bg-white w-[50px] h-[50px] rounded-full object-cover'
                                src={userdata?.profilePhoto}
                                alt="profile"
                            />
                            <h2 className="text-xl font-semibold text-white">Vishnu</h2>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-xs text-white  uppercase tracking-wider">
                                Profile
                            </div>
                            <button
                                onClick={() => handleNavigate('/account')}
                                className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full"
                            >
                                <User className="w-5 h-5" />
                                <span>Personal Information</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs text-white uppercase tracking-wider">
                                Security
                            </div>
                            <button
                                onClick={() => handleNavigate('/account/change-password')}
                                className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full"
                            >
                                <Lock className="w-5 h-5" />
                                <span>Change Password</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs text-white uppercase tracking-wider">
                                Financial
                            </div>
                            <button
                                onClick={() => handleNavigate('/account/wallet')}
                                className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full"
                            >
                                <Wallet className="w-5 h-5" />
                                <span>Wallet</span>
                            </button>
                            <button
                                onClick={() => handleNavigate('/account/orders')}
                                className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full"
                            >
                                <List className="w-5 h-5" />
                                <span>Order List</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs text-white uppercase tracking-wider">
                                My Courses
                            </div>
                            <button
                                onClick={() => handleNavigate('/account/my-courses')}
                                className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md w-full"
                            >
                                <BookOpen className="w-5 h-5" />
                                <span>Course List</span>
                            </button>
                        </div>

                        <div className="pt-4 border-t">
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 text-red-600 hover:bg-red-50 p-2 rounded-md w-full"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default UserAccountSidebar;