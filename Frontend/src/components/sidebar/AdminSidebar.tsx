import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  Clock,
  LogOut,
  Home,
  BarChart,
  CheckCircle2
} from 'lucide-react';
import { useInstituteListQuery, useUserListQuery } from '../../store/slices/adminSlice';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { data: users, error } = useUserListQuery(null);
  const {data: institutes} = useInstituteListQuery(null);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleUserList = () => {
    if (users) {
      console.log("User list fetched successfully:", users);
      navigate('/admin/user-list');
    } else if (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const handleInstitutionList = () => {
    if (institutes) {
      console.log("Institute list fetched successfully:", institutes);
      navigate('/admin/institute-list');
    } 
  };

  const handleLogout = (): void => {
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white">
      {/* Logo/Brand Area */}
      <div className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Admin Portal</h1>
      </div>

      {/* Navigation Links */}
      <div className="p-4 border-b border-gray-800">
        <div className="mb-6 pt-5">
          <button 
            onClick={() => handleNavigate('/admin/dashboard')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>

        <div className="mb-6 space-y-8">
          <div className="mb-2 text-gray-500 text-sm uppercase">
            User Management
          </div>
          <button 
            onClick={handleUserList}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <Users className="w-5 h-5 ml-5" />
            <span>All Users</span>
          </button>
        </div>

        <div className="mb-6 space-y-8">
          <div className="ml-0 mb-2 text-gray-500 text-sm uppercase">
            Institute Management
          </div>
          <div className='ml-5'>
            <div className="space-y-2">
              <button 
                className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
              >
                <Building2 className="w-5 h-5" />
                <span>All Institutes</span>
              </button>
              
              <button 
                onClick={handleInstitutionList}
                className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
              >
                <Clock className="w-5 h-5" />
                <span>Pending Approvals</span>
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  3
                </span>
              </button>
              
              <button 
                onClick={() => handleNavigate('/approved-institutes')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Approved Institutes</span>
              </button>
              
              <button 
                onClick={() => handleNavigate('/analytics')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
              >
                <BarChart className="w-5 h-5" />
                <span>Analytics</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
