import React, {useEffect} from 'react'
import HomeLayout from '../../layout/userLayout/HomeLayout'
import { useNavigate } from 'react-router-dom';

const UserHome = () => {

  const navigate = useNavigate();
  const isLoggedIn = true;

  useEffect(() => {
    if (isLoggedIn) {
      window.history.pushState(null, '', window.location.href);

      const handlePopState = (event: PopStateEvent) => {
        window.history.pushState(null, '', window.location.href);
        alert("Back navigation is disabled when you're logged in.");
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isLoggedIn]);
  return (
    <div>
      <HomeLayout />
    </div>
  )
}

export default UserHome