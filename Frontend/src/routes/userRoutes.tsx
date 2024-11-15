import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from '../pages/LandingPage';
import UserHome from '../pages/user/UserHome';
import UserProtectedRoute from './ProtectedRoute/UserProtectedRoute';
import { RootState } from '../store';
import { Navigate } from 'react-router-dom';
import ErrorPage from '../pages/user/errorPage';
import UserCart from '../pages/user/UserCart';
import CourseList from '../pages/user/CourseList';

const UserRoutes: React.FC = () => {

  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isUserAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserAuthenticated) {
      navigate('/');
    }
  }, [isUserAuthenticated, navigate]);
  return (
    <Routes>
      <Route
        path="/"
        element={isUserAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />}
      />
      <Route
        path="/home"
        element={
          <UserProtectedRoute>
            <UserHome />
          </UserProtectedRoute>
        }
      />

      <Route
      path="/cart"
      element={
        <UserProtectedRoute>
          <UserCart />
        </UserProtectedRoute>
      }
      />

      <Route
      path="/course"
      element={
        <UserProtectedRoute>
          <CourseList />
        </UserProtectedRoute>
      }
      />


      <Route path="*" element={<ErrorPage />} />

    </Routes>
  );
};

export default UserRoutes;