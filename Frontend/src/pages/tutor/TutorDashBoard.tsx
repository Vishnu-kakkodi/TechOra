import React, {useEffect} from 'react'
import InstituteSidebar from '../../components/sidebar/InstituteSidebar'
import Dashboard from '../../layout/AdminLayout/Dashboard';

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
    <InstituteSidebar />
    <Dashboard />
    </div>
  )
}

export default TutorDashBoard