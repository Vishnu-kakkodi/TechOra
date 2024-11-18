import React from 'react';
import InstitutionList from '../../layout/AdminLayout/InstituteList';
import Sidebar from '../../components/sidebar/AdminSidebar';
import ApprovedInstitution from '../../layout/AdminLayout/ApprovedInstitution';

const ApprovedInstitutionPage = () => {
  return (
    <div className="flex h-screen">
      <div className=" bg-gray-800 text-white">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 bg-gray-100">
        <ApprovedInstitution />
      </div>
    </div>
  );
};

export default ApprovedInstitutionPage;
