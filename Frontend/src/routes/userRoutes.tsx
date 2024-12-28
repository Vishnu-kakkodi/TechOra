import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import PaymentSuccess from '../pages/user/PaymentSuccess';
import ChangePassword from '../layout/userLayout/ChangePassword';
import Profile from '../layout/userLayout/Profile/Profile';
import OrderList from '../layout/userLayout/OrderList';
import OrderDetail from '../layout/userLayout/OrderDetail';
import MyCourses from '../layout/userLayout/MyCourses';
import CourseDetail from '../pages/user/CourseDetail/CourseDetail';
import BlcokPage from '../pages/user/BlcokPage';
import LeaderBoard from '../pages/user/LeaderBoard';
import Wishlist from '../layout/userLayout/Wishlist';
import LandingPage from '../pages/LandingPage';
import UserHome from '../pages/user/UserHome';


const UserRoutes: React.FC = () => {

  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isUserAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
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
        path="/account-blocked" element={<BlcokPage />}
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
        path="/leaderboard"
        element={
          <AuthRoute role={'user'}>
            <LeaderBoard />
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
        path="/start-quiz/:quizId"
        element={
          <AuthRoute role={'user'}>
            <QuizAttempt />
          </AuthRoute>
        }
      />

      <Route
        path="/course-view/:courseId"
        element={
          <AuthRoute role={'user'}>
            <CourseDetail />
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
      >
        <Route index element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="order-detail/:orderId" element={<OrderDetail />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="favourate" element={<Wishlist />} />




      </Route>

      <Route
        path="/success"
        element={
          <AuthRoute role={'user'}>
            <PaymentSuccess />
          </AuthRoute>
        }
      />


      <Route path="*" element={<ErrorPage />} />

    </Routes>
  );
};

export default UserRoutes;