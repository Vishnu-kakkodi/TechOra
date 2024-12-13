import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import UserRoutes from './routes/userRoutes';
import AdminRoutes from './routes/adminRoute';
import InstituteRoutes from './routes/institutionRoute';
import { ToastContainer } from 'react-toastify';
import { useAxiosInterceptor } from './utils/axiosInstance';
import TutorRoutes from './routes/tutorRoute';

function App() {
  useAxiosInterceptor();
  return (
    <>
     <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/institute/*" element={<InstituteRoutes />} />
        <Route path="/tutor/*" element={<TutorRoutes />} />

    </Routes>
    </>

  );
}

export default App;
