
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import axios, { AxiosError } from 'axios';
import { axiosInstance } from '../utils/axiosInstance';

interface ProtectedRouteProps {
  role: 'user' | 'institute' | 'admin' | 'tutor';
  children: JSX.Element;
}

interface AuthError {
  success: boolean;
  message: string;
  code?: string;
}

const AuthRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isUserAuthenticated);
  const isInstituteAuthenticated = useSelector((state: RootState) => state.auth.isInstituteAuthenticated);
  const isAdminAuthenticated = useSelector((state: RootState) => state.auth.isAdminAuthenticated);
  const isTutorAuthenticated = useSelector((state: RootState) => state.auth.isTutorAuthenticated);


  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsLoading(true);
        console.log("AuthRoute");
        
        const response = await axiosInstance.get('/api/auth/verify-accessToken', {
          headers: { Role: role }
      });  
           console.log(response,"Response");
      } catch (err) {
        const error = err as AxiosError<AuthError>;
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [ dispatch, navigate, role]);

  const getRedirectPath = (userRole: string): string => {
    switch (userRole) {
      case 'user':
        return '/';
      case 'institute':
        return '/institute/login';
      case 'admin':
        return '/admin/login';
      case 'tutor':
        return '/tutor/login';
      default:
        return '/';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }


  const isAuthenticated = (): boolean => {
    switch (role) {
      case 'user':
        return isUserAuthenticated;
      case 'institute':
        return isInstituteAuthenticated;
      case 'admin':
        return isAdminAuthenticated;
      case 'tutor':
        return isTutorAuthenticated;
      default:
        return false;
    }
  };

  if (!isAuthenticated()) {
    return <Navigate to={getRedirectPath(role)} replace />;
  }

  return children;
};

export default AuthRoute;