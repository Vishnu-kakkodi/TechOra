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
          <InstituteProtectedRoute>
            <InstituteDashboard />
          </InstituteProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <InstituteProtectedRoute>
            <CourseList />
          </InstituteProtectedRoute>
        }
      />

      <Route
        path="/course-view/:courseId"
        element={
          <InstituteProtectedRoute>
            <CourseDetail />
          </InstituteProtectedRoute>
        }
      />

      <Route
        path="/course-add"
        element={
          <InstituteProtectedRoute>
            <AddCourse />
          </InstituteProtectedRoute>
        }
      />

      <Route
        path="/upload-videos"
        element={
          <InstituteProtectedRoute>
            <CourseModules />
          </InstituteProtectedRoute>
        }
      />

      <Route
        path="/course-drafts"
        element={
          <InstituteProtectedRoute>
            <DraftCourses />
          </InstituteProtectedRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default InstituteRoutes;