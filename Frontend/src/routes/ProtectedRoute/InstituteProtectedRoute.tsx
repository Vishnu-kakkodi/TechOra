
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const InstituteProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isInstituteAuthenticated = useSelector((state: RootState) => state.auth.isInstituteAuthenticated);
  console.log(isInstituteAuthenticated,"page")

  if (!isInstituteAuthenticated) {
    return <Navigate to="/institute/login" replace />;
  }

  return children;
};

export default InstituteProtectedRoute;
