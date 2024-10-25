import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { logout } from './store/slices/authSlice';
import LoginButton from './components/buttons/SignUpButton';
import LandingPage from './pages/LandingPage';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  // const handleLogout = () => {
  //   dispatch(logout());
  // };

  return (
    <>
      <LandingPage />
    </>
  );
}

export default App;
