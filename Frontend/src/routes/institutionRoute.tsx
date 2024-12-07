// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import InstituteDashboard from '../pages/institute/InstituteDashboard';
// import InstituteLogin from '../pages/institute/InstituteLogin';
// import InstituteRegister from '../pages/institute/InstituteRegister';

// const InstituteRoutes: React.FC = () => {
//   return (
//     <Routes>
//       <Route path="/login" element={<InstituteLogin />} />
//       <Route path="/register" element={<InstituteRegister />} />
//       <Route path="/dashboard" element={<InstituteDashboard />} />
//     </Routes>
//   );
// };

// export default InstituteRoutes;



import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import InstituteDashboard from '../pages/institute/InstituteDashboard';
import InstituteLogin from '../pages/institute/InstituteLogin';
import InstituteRegister from '../pages/institute/InstituteRegister';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Navigate } from 'react-router-dom';
import InstituteProtectedRoute from './ProtectedRoute/InstituteProtectedRoute';
import ErrorPage from '../pages/institute/errorPage';
import CourseList from '../pages/institute/CourseList';
import CourseDetail from '../pages/institute/CourseDetail';
import AddCourse from '../pages/institute/AddCourse';
import CourseModules from '../pages/institute/CourseModules';
import DraftCourses from '../pages/institute/DraftCourses';
import AuthRoute from './AuthRoute';
import TutorListPage from '../pages/institute/TutorListPage';
import CreateQuiz from '../pages/institute/CreateQuiz';
import ListQuiz from '../pages/institute/ListQuiz';
import QuizDetail from '../pages/institute/QuizDetail';
import EditQuiz from '../pages/institute/EditQuiz';
import EditCourse from '../pages/institute/EditCourse';

const InstituteRoutes: React.FC = () => {

  const isInstituteAuthenticated = useSelector((state: RootState) => state.auth.isInstituteAuthenticated);
  console.log(isInstituteAuthenticated)
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
        path="/course-add"
        element={
          <AuthRoute role='institute'>
            <AddCourse />
          </AuthRoute>
        }
      />

      <Route
        path="/upload-videos"
        element={
          <AuthRoute role='institute'>
            <CourseModules />
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
        path="/courses/edit/:courseId"
        element={
          <AuthRoute role='institute'>
            <EditCourse />
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
        path="/add-quiz"
        element={
          <AuthRoute role='institute'>
            <CreateQuiz />
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
        path="/edit-quiz/:quizId"
        element={
          <AuthRoute role='institute'>
            <EditQuiz />
          </AuthRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default InstituteRoutes;