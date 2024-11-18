// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store';
// import axios, { AxiosError } from 'axios';

// interface ProtectedRouteProps {
//   role: 'user' | 'institute' | 'admin';
//   children: JSX.Element;
// }

// const AuthRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const isUserAuthenticated = useSelector((state: RootState) => state.auth.isUserAuthenticated);
//   const isInstituteAuthenticated = useSelector((state: RootState) => state.auth.isInstituteAuthenticated);
//   const isAdminAuthenticated = useSelector((state: RootState) => state.auth.isAdminAuthenticated);

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         setIsLoading(true);
//         await axios.post('/auth/verify-accessToken');
//       } catch (err) {
//         const error = err as AxiosError;
//         setError(error.message || 'Authentication failed');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     verifyToken();
//   }, []);

//   if (isLoading) {
//     return <div className="flex items-center justify-center p-4">Loading...</div>;
//   }

//   if (error) {
//     console.error('Authentication error:', error);
//   }

//   const checkAuth = () => {
//     switch (role) {
//       case 'user':
//         if (!isUserAuthenticated) {
//           return <Navigate to="/" replace />;
//         }
//         break;
//       case 'institute':
//         if (!isInstituteAuthenticated) {
//           return <Navigate to="/institute/login" replace />;
//         }
//         break;
//       case 'admin':
//         if (!isAdminAuthenticated) {
//           return <Navigate to="/admin/login" replace />;
//         }
//         break;
//       default:
//         return <Navigate to="/" replace />;
//     }

//     return children;
//   };

//   return checkAuth();
// };

// export default AuthRoute;



import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import axios, { AxiosError } from 'axios';
import axiosInstance from '../utils/axiosInstance';

interface ProtectedRouteProps {
  role: 'user' | 'institute' | 'admin';
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


  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsLoading(true);
        console.log("AuthRoute");
        
        const response = await axiosInstance.get('/api/auth/verify-accessToken');
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