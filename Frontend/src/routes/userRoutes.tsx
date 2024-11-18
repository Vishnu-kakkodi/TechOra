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
import AuthRoute from './AuthRoute';
import Account from '../pages/user/Account';
import ForgotPasswordPage from '../components/modals/ForgotPassword';
import QuizList from '../pages/user/QuizList';
import QuizAttempt from '../pages/user/QuizAttempt';

const UserRoutes: React.FC = () => {

  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isUserAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    // if (!isUserAuthenticated) {
    //   navigate('/');
    // }
  }, [isUserAuthenticated, navigate]);
  return (
    <Routes>
      <Route
        path="/"
        element={isUserAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />}
      />

      <Route
        path="/forgot-password"
        element={isUserAuthenticated ? <Navigate to="/home" replace /> : <ForgotPasswordPage />}
      />

      <Route
        path="/home"
        element={
          <AuthRoute role={'user'}>
            <UserHome />
          </AuthRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <AuthRoute role={'user'}>
            <UserCart />
          </AuthRoute>
        }
      />

      <Route
        path="/course"
        element={
          <AuthRoute role={'user'}>
            <CourseList />
          </AuthRoute>
        }
      />

      <Route
        path="/quiz"
        element={
          <AuthRoute role={'user'}>
            <QuizList />
          </AuthRoute>
        }
      />

      <Route
        path="/start-quiz"
        element={
          <AuthRoute role={'user'}>
            <QuizAttempt />
          </AuthRoute>
        }
      />

      <Route
        path="/account"
        element={
          <AuthRoute role={'user'}>
            <Account />
          </AuthRoute>
        }
      />


      <Route path="*" element={<ErrorPage />} />

    </Routes>
  );
};

export default UserRoutes;