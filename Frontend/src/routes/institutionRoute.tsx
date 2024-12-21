
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InstituteDashboard from '../pages/institute/InstituteDashboard';
import InstituteLogin from '../pages/institute/InstituteLogin';
import InstituteRegister from '../pages/institute/InstituteRegister';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Navigate } from 'react-router-dom';
import ErrorPage from '../pages/institute/errorPage';
import CourseList from '../pages/institute/CourseList';
import CourseDetail from '../pages/institute/CourseDetail';
import DraftCourses from '../pages/institute/DraftCourses';
import AuthRoute from './AuthRoute';
import TutorListPage from '../pages/institute/TutorListPage';
import ListQuiz from '../pages/institute/ListQuiz';
import QuizDetail from '../pages/institute/QuizDetail';
import DepartmentList from '../pages/institute/DepartmentList';

const InstituteRoutes: React.FC = () => {

  const isInstituteAuthenticated = useSelector((state: RootState) => state.auth.isInstituteAuthenticated);

  return (
    <Routes>
      <Route
        path="/login"
        element={isInstituteAuthenticated ? <Navigate to="/institute/dashboard" replace /> : <InstituteLogin />}
      />
      <Route
        path="/register"
        element={isInstituteAuthenticated ? <Navigate to="/institute/dashboard" replace /> : <InstituteRegister />}
      />
      <Route
        path="/dashboard"
        element={
          <AuthRoute role='institute'>
            <InstituteDashboard />
          </AuthRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <AuthRoute role='institute'>
            <CourseList />
          </AuthRoute>
        }
      />

      <Route
        path="/course-view/:courseId"
        element={
          <AuthRoute role='institute'>
            <CourseDetail />
          </AuthRoute>
        }
      />

      <Route
        path="/course-drafts"
        element={
          <AuthRoute role='institute'>
            <DraftCourses />
          </AuthRoute>
        }
      />

      <Route
        path="/tutors"
        element={
          <AuthRoute role='institute'>
            <TutorListPage />
          </AuthRoute>
        }
      />

      <Route
        path="/quizzes"
        element={
          <AuthRoute role='institute'>
            <ListQuiz />
          </AuthRoute>
        }
      />

      <Route
        path="/quiz/:quizId"
        element={
          <AuthRoute role='institute'>
            <QuizDetail />
          </AuthRoute>
        }
      />

      <Route
        path="/departments"
        element={
          <AuthRoute role='institute'>
            <DepartmentList />
          </AuthRoute>
        }
      />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default InstituteRoutes;