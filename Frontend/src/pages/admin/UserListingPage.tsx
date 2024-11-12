import React from 'react';
import UserList from '../../layout/AdminLayout/UserList';
import Sidebar from '../../components/sidebar/AdminSidebar';

const UserListingPage = () => {
  return (
    <div className="flex h-screen">
      <div className=" bg-gray-800 text-white">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 bg-gray-100">
        <UserList />
      </div>
    </div>
  );
};

export default UserListingPage;
