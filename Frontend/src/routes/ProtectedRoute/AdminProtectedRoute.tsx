
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAdminAuthenticated = useSelector((state: RootState) => state.auth.isAdminAuthenticated);
  console.log(isAdminAuthenticated,"page")

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
