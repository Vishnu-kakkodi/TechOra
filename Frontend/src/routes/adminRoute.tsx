import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserListingPage from '../pages/admin/UserListingPage';
import InstituteListingPage from '../pages/admin/InstitutionListPage';
import ErrorPage from '../pages/admin/errorPage';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import InstituteDetail from '../pages/admin/InstituteDetail';
import AuthRoute from './AuthRoute';
import ApprovedInstitutionPage from '../pages/admin/ApprovedInstitutionPage';
import AllInstitutePage from '../pages/admin/AllInstitutePage';



const AdminRoutes: React.FC = () => {
  const isAdminAuthenticated = useSelector((state: RootState) => state.auth.isAdminAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={isAdminAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} />
      <Route path="/dashboard" element={
        <AuthRoute role='admin'>
          <AdminDashboard />
        </AuthRoute>
      } />
      <Route path="/user-list" element={
        <AuthRoute role='admin'>
          <UserListingPage />
        </AuthRoute>} />
      <Route path="/institute-list" element={
        <AuthRoute role='admin'>
          <InstituteListingPage />
        </AuthRoute>
      } />
      <Route path="/institute-detail/:instituteId" element={
        <AuthRoute role='admin'>
          <InstituteDetail />
        </AuthRoute>
      } />
      <Route path="/approved-institute" element={
        <AuthRoute role='admin'>
          <ApprovedInstitutionPage />
        </AuthRoute>
      } />

      <Route path="/all-institute" element={
        <AuthRoute role='admin'>
          <AllInstitutePage />
        </AuthRoute>
      } />
      <Route path="*" element={<ErrorPage />} />

    </Routes>
  );
};

export default AdminRoutes;