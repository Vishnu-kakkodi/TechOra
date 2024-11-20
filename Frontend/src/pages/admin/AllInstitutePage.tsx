import React from 'react';
import Sidebar from '../../components/sidebar/AdminSidebar';
import AllInstitutes from '../../layout/AdminLayout/AllInstitutes';

const AllInstitutePage = () => {
  return (
    <div className="flex h-screen">
      <div className=" bg-gray-800 text-white">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 bg-gray-100">
        <AllInstitutes />
      </div>
    </div>
  );
};

export default AllInstitutePage;
