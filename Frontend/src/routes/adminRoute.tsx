import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserListingPage from '../pages/admin/UserListingPage';
import InstituteListingPage from '../pages/admin/InstitutionListPage';


const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/user-list" element={<UserListingPage />} />
      <Route path="/institute-list" element={<InstituteListingPage />} />

    </Routes>
  );
};

export default AdminRoutes;