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
import { useAdminLogoutCallMutation, useInstituteListQuery, useUserListQuery } from '../../store/slices/adminSlice';
import { adminLogout } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store/hook';
import { toast } from 'react-toastify';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [adminLogoutCall] = useAdminLogoutCallMutation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleUserList = () => {
      navigate('/admin/user-list');
  };

  const handleInstitutionList = () => {
      navigate('/admin/institute-list');
  };

  const handleAllInstitutionList = () => {
      navigate('/admin/all-institute');
  };

  const handleApprovedInstitution = () => {
      navigate('/admin/approved-institute');
  };

  const handleLogout = async () => {
    const response = await adminLogoutCall().unwrap();
    toast.success("Logout successfully");
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white">
      <div className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Admin Portal</h1>
      </div>

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

        <div className="mb-6 space-y-10">
          <div className="ml-0 mb-2 text-gray-500 text-sm uppercase">
            Institute Management
          </div>
          <div className='ml-5'>
            <div className="space-y-8">
              <button 
              onClick={handleAllInstitutionList}
                className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
              >
                <Building2 className="w-5 h-5" />
                <span>All Institutes</span>
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
