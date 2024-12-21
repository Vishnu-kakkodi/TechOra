import React, {useEffect} from 'react'
import InstituteSidebar from '../../components/sidebar/InstituteSidebar'
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import Dashboard from '../../layout/TutorLayout/Dashboard';

const TutorDashBoard = () => {

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
    <div className='flex'>
    <Dashboard />
    </div>
  )
}

export default TutorDashBoard