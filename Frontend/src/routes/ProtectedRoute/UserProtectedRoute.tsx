
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const UserProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isUserAuthenticated);

  if (!isUserAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserProtectedRoute;
