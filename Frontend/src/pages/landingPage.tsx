import React, { useState } from 'react';
import LandingPageHeader from '../components/header/LandingPage';
import landingPageIMG from '../assets/frontEnd/landingPageIMG.png';
import coursePic from '../assets/frontEnd/coursePic.jpg';
import SignUpButton from '../components/buttons/SignUpButton';
import SignUpModal from '../components/modals/SignUpModal';
import LoginButton from '../components/buttons/LoginButton';
import LoginModal from '../components/modals/LoginModal';
import HomeLayout3 from '../layout/userLayout/HomeLayout1';
import HomeLayout2 from '../layout/userLayout/HomeLayout2';
import AboutLayout from '../layout/userLayout/AboutLayout';
import Footer from '../components/footer/Footer';



const LandingPage = () => {
  const [isModalOpen,setModalOpen] = useState(false);
  const [isLoginModalOpen,setLoginModal] = useState(false)
  console.log(isModalOpen,"hai")
  
  return (
    <div className=" min-h-screen">
      <LandingPageHeader />
      <HomeLayout3 />
      <AboutLayout />
      <HomeLayout2 />
      <Footer />
      <hr className='boarder-t boareder-grey-300' />

    </div>
  );
};

export default LandingPage;
