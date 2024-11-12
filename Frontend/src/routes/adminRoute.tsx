import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserListingPage from '../pages/admin/UserListingPage';
import InstituteListingPage from '../pages/admin/InstitutionListPage';
import ErrorPage from '../pages/admin/errorPage';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AdminProtectedRoute from './ProtectedRoute/AdminProtectedRoute';
import InstituteDetail from '../pages/admin/InstituteDetail';



const AdminRoutes: React.FC = () => {
  const isAdminAuthenticated = useSelector((state: RootState) => state.auth.isAdminAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={isAdminAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} />
      <Route path="/dashboard" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
      <Route path="/user-list" element={
        <AdminProtectedRoute>
          <UserListingPage />
        </AdminProtectedRoute>} />
      <Route path="/institute-list" element={
        <AdminProtectedRoute>
          <InstituteListingPage />
        </AdminProtectedRoute>
      } />
      <Route path="/institute-detail/:instituteId" element={
        <AdminProtectedRoute>
          <InstituteDetail />
        </AdminProtectedRoute>
      } />
      <Route path="*" element={<ErrorPage />} />

    </Routes>
  );
};

export default AdminRoutes;