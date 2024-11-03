import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InstituteDashboard from '../pages/institute/InstituteDashboard';
import InstituteLogin from '../pages/institute/InstituteLogin';
import InstituteRegister from '../pages/institute/InstituteRegister';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<InstituteLogin />} />
      <Route path="/register" element={<InstituteRegister />} />
      <Route path="/dashboard" element={<InstituteDashboard />} />
    </Routes>
  );
};

export default AdminRoutes;