

import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Navigate } from 'react-router-dom';
import TutorLogin from '../pages/tutor/TutorLogin';
import Dashboard from '../layout/TutorLayout/Dashboard';
import AuthRoute from './AuthRoute';
import CourseList from '../pages/tutor/CourseList';
import CourseDetail from '../pages/tutor/CourseDetail';
import AddCourse from '../pages/tutor/AddCourse';
import CourseModules from '../pages/tutor/CourseModules';
import DraftCourses from '../pages/tutor/DraftCourses';
import EditCourseDetail from '../pages/tutor/EditCourse';
import TutorListPage from '../pages/tutor/TutorListPage';
import CreateQuiz from '../pages/tutor/CreateQuiz';
import ListQuiz from '../pages/tutor/ListQuiz';
import QuizDetail from '../pages/tutor/QuizDetail';
import EditQuiz from '../pages/tutor/EditQuiz';
import ErrorPage from '../pages/tutor/errorPage';
import Profile from '../pages/tutor/Profile';
import ChangePassword from '../pages/tutor/ChangePassword';
import ChatSession from '../pages/tutor/ChatSession';

const TutorRoutes: React.FC = () => {

  const isTutorAuthenticated = useSelector((state: RootState) => state.auth.isTutorAuthenticated);
  console.log(isTutorAuthenticated)
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isInstituteAuthenticated) {
  //     navigate('/institute/login');
  //   }
  // }, [isInstituteAuthenticated, navigate]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isTutorAuthenticated ? <Navigate to="/tutor/dashboard" replace /> : <TutorLogin />}
      />
      <Route
        path="/dashboard"
        element={
          <AuthRoute role='tutor'>
            <Dashboard />
          </AuthRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <AuthRoute role='tutor'>
            <CourseList />
          </AuthRoute>
        }
      />

      <Route
        path="/course-view/:courseId"
        element={
          <AuthRoute role='tutor'>
            <CourseDetail />
          </AuthRoute>
        }
      />

      <Route
        path="/course-add"
        element={
          <AuthRoute role='tutor'>
            <AddCourse />
          </AuthRoute>
        }
      />

      <Route
        path="/upload-videos"
        element={
          <AuthRoute role='tutor'>
            <CourseModules />
          </AuthRoute>
        }
      />

      <Route
        path="/course-drafts"
        element={
          <AuthRoute role='tutor'>
            <DraftCourses />
          </AuthRoute>
        }
      />

      <Route
        path="/courses/edit/:courseId"
        element={
          <AuthRoute role='tutor'>
            <EditCourseDetail />
          </AuthRoute>
        }
      />

      <Route
        path="/tutors"
        element={
          <AuthRoute role='tutor'>
            <TutorListPage />
          </AuthRoute>
        }
      />

      <Route
        path="/add-quiz"
        element={
          <AuthRoute role='tutor'>
            <CreateQuiz />
          </AuthRoute>
        }
      />

      <Route
        path="/quizzes"
        element={
          <AuthRoute role='tutor'>
            <ListQuiz />
          </AuthRoute>
        }
      />

      <Route
        path="/quiz/:quizId"
        element={
          <AuthRoute role='tutor'>
            <QuizDetail />
          </AuthRoute>
        }
      />

      <Route
        path="/edit-quiz/:quizId"
        element={
          <AuthRoute role='tutor'>
            <EditQuiz />
          </AuthRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <AuthRoute role='tutor'>
            <Profile />
          </AuthRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <AuthRoute role='tutor'>
            <ChangePassword />
          </AuthRoute>
        }
      />

      <Route
      path="/chat"
      element={
        <AuthRoute role='tutor'>
          <ChatSession/>
        </AuthRoute>
      }
      />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default TutorRoutes;