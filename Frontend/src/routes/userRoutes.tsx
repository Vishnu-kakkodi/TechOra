import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import UserHome from '../pages/user/UserHome';

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<UserHome />} />
    </Routes>
  );
};

export default UserRoutes;