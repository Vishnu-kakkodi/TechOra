
// import React from 'react'
// import landingPageIMG from '../../assets/frontEnd/landingPageIMG.png'
// import coursePic from '../../assets/frontEnd/coursePic.jpg'
// import {
//   ArrowRight
// } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'

// const HomeLayout1 = () => {

//   const navigate = useNavigate();

//   return (
//     <div>
//       <hr className='boarder-t boareder-grey-300' />
//       <main className="container bg-custom-gradient ml-2container">
//         <div className=' flex items-center h-[100vh]'>
//           <div className="w-1/2 ml-[130px] mb-[120px]">
//             <p className="text-[14px] font-bold text-left text-black mb-2 font-inter capitalize tracking-tight">
//               Build Your Future
//             </p>
//             <h1 className="text-[45px] font-bold text-left text-black mb-2 font-inter capitalize tracking-tight">
//               Let's Build Skills
//             </h1>
//             <p className="text-[45px] font-bold text-left text-black mb-2 font-jakarta">
//               WITH <span className="text-yellow-500">techOra</span> & LEARN
//             </p>
//             <p className="text-[45px] font-bold text-left text-black mb-2 font-inter capitalize tracking-tight">
//               without limits
//             </p>
//             <p className="text-[14px] font-bold text-left text-black mb-6 font-inter capitalize tracking-tight">
//               Take your learning organization to the next level.
//             </p>
//             <div className='flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4 mb-2'>
//               <button 
//                 onClick={() => navigate('/institute/login')}
//                 className='bg-yellow-500 text-black text-center rounded-[5px] p-3 w-full sm:w-auto'
//               >
//                 Login as Institution
//               </button>
//               <ArrowRight className="text-white w-9 h-9 hidden sm:block" />
//             </div>
//           </div>

//           <div className="flex items-end justify-end w-full h-[585px]">
//             <img src={landingPageIMG} alt="Description of the image" className="w-[957px] h-auto" />
//           </div>

//         </div>
//       </main>
//     </div>
//   )
// }

// export default HomeLayout1





import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Star, CheckCircle, User, X, Menu } from 'lucide-react';
import { useHomeDataQuery } from '../../store/slices/userSlice';
import { CourseDocument } from '../../types/courseType';
import HomePic from '../../assets/frontEnd/HomePic.jpg'
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hook';
import LogoutButton from '../../components/buttons/LogoutButton';
import HomePic1 from '../../assets/frontEnd/landingPageIMG.png'
import HomeLayout from './HomeLayout';
import LoginButton from '../../components/buttons/LoginButton';
import SignUpButton from '../../components/buttons/SignUpButton';
import SignUpModal from '../../components/modals/SignUpModal';
import LoginModal from '../../components/modals/LoginModal';
import EmailVerify from '../../components/modals/EmailVerify';
import OtpModal from '../../components/modals/OtpModal';
import InstitutionLogin from '../../components/buttons/InstitutionLogin';


const HomeLayout1 = () => {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isEmailVerifyOpen, setEmailVerifyOpen] = useState(false);
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);

  const [otpMode, setOtpMode] = useState<'signup' | 'verifyEmail' | 'forgotPassword'>('signup');


  const userdata = useAppSelector((state) => state.auth.userInfo);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  const { data = {} } = useHomeDataQuery(null);
  const courses = data.course || [] as any;

  const handleForgotPassword = () => {
    setLoginModalOpen(false);
    setEmailVerifyOpen(true);
    setOtpMode('forgotPassword');
  };

  const handleSignUpOtp = () => {
    setOtpMode('signup');
    setOtpModalOpen(true);
  };

  const handleOtpModalOpen = (mode: 'signup' | 'verifyEmail' | 'forgotPassword') => {
    setOtpMode(mode);
    setOtpModalOpen(true);
  };


  return (
    <>
    <div>
      {/* Hero Section with Background Image */}
      <div
        className=" bg-cover bg-center bg-no-repeat min-h-screen items-center"
        style={{
          backgroundImage: `url(${HomePic})`,
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0,0,0,0.6)'
        }}
      >
        <header className="w-full top-0 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex flex-col">
                  <span className="text-2xl md:text-[35px] text-yellow-400 font-bold tracking-tight leading-tight">
                    TechOra
                  </span>
                  <span className="text-[8px] md:text-[10px] text-white/80 -mt-1 ml-1">
                    Let's Build Your Future
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="text-white/90 font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white/10"
                  >
                    {item}
                  </Link>
                ))}
                <div className="flex space-x-10">
                <SignUpButton handleSignUp={() => setSignUpModalOpen(true)} />
              <LoginButton handleLogin={() => setLoginModalOpen(true)} />
                <InstitutionLogin/>
            </div>
              </nav>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-blue-700/20 transition duration-150 ease-in-out"
                >
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {/* <div
              className={`${isOpen ? 'block' : 'hidden'
                } md:hidden transition-all duration-300 ease-in-out bg-blue-600/80 backdrop-blur-md rounded-lg shadow-lg`}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="text-white hover:text-yellow-300 hover:bg-blue-700/30 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <div className="pt-2">
                  <LogoutButton />
                </div>
              </div>
            </div> */}
          </div>
        </header>
        <div className='flex'>
        <div className="container mt-[150px] px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl font-bold mb-6 text-white">
              Unlock Your Potential
            </h1>
            <p className="text-2xl mb-8 text-gray-200">
              Dive into transformative learning experiences that empower your personal and professional growth.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500 text-black px-8 py-4 rounded-full flex items-center space-x-3 text-lg font-semibold hover:bg-yellow-600 transition"
            >
              <span>Start Your Journey</span>
              <ArrowRight size={24} />
            </motion.button>
          </motion.div>
        </div>
        <div className="flex items-end justify-end w-full h-[700px]">
            <img src={HomePic1} alt="Description of the image" className="w-[957px] h-full" />
        </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
        </div>
      </div>
    </div>
          {isSignUpModalOpen && (
            <SignUpModal
              setSignUpModalOpen={setSignUpModalOpen}
              setOtpModalOpen={() => handleOtpModalOpen('signup')}
            />
          )}
    
          {isLoginModalOpen && (
            <LoginModal 
              setLoginModalOpen={setLoginModalOpen} 
              setOtpModalOpen={() => handleOtpModalOpen('verifyEmail')}
              onForgotPassword={handleForgotPassword}
            />
          )}
    
          {isEmailVerifyOpen && (
            <EmailVerify
              setEmailVerify={setEmailVerifyOpen}
              setOtpModalOpen={() => handleOtpModalOpen('forgotPassword')}
              mode="user"
            />
          )}
    
          {isOtpModalOpen && (
            <OtpModal 
              setOtpModalOpen={setOtpModalOpen} 
              mode={otpMode}
            />
          )}
    </>

  );
};

export default HomeLayout1;