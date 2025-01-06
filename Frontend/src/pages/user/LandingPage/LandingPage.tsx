
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Star, CheckCircle, User, X, Menu, Languages, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactStars from 'react-stars';
import QuizPic from '../../../assets/frontEnd/Quiz.jpg'
import { useAppSelector } from '../../../store/hook';
import SignUpButton from '../../../components/buttons/SignUpButton';
import Hero from '../../../layout/userLayout/Hero';
import SignUpModal from '../../../components/modals/SignUpModal';
import LoginModal from '../../../components/modals/LoginModal';
import EmailVerify from '../../../components/modals/EmailVerify';
import OtpModal from '../../../components/modals/OtpModal';
import LanguageSelectModal from '../../../components/modals/LanguageSelectModal';
import Footer from '../../../components/footer/Footer';
import { useHomeDataQuery } from '../../../store/slices/userSlice';
import Hero1 from '../../../layout/userLayout/Hero1';
import Hero2 from '../../../layout/userLayout/Hero2';
import Hero3 from '../../../layout/userLayout/Hero3';
import Hero4 from '../../../layout/userLayout/Hero4';
import { CourseDocument } from 'src/types/courseType';



interface LoginButtonProps{
    label?: string;
    className?:string;
    handleLogin?: () => void
    setModalOpen?: (state: boolean) => void;
}

const LoginButton: React.FC<LoginButtonProps>=({
    handleLogin
}) => {
    return (
        <>
        <button
        onClick={handleLogin}
        className={`ml-4 text-[14px] font-[800] capitalize text-black bg-transparent border-2 border-black hover:bg-yellow-500 hover:text-black px-[30px] py-[11px]`}>
            Log in
        </button>
        </>
    )
}


const LandingPage = () => {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
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
  const courses: CourseDocument[] = data.courses?.course || [];
  const winners = data.winners?.quizWinners || [] as any;

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

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    console.log('Selected Language:', language);
  };


  return (
    <>
      <div>
        <div className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col">
          <header className="w-full top-0 shadow-lg bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="flex items-center space-x-4">
                  <Link to="/" className="flex flex-col">
                    <span className="text-2xl md:text-[35px] text-black font-bold tracking-tight leading-tight">
                      TechOra
                    </span>
                    <span className="text-[8px] md:text-[10px] text-black/80 -mt-1 ml-1">
                      Let's Build Your Future
                    </span>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  {/* Buttons and Language Selector */}
                  <div className="flex space-x-4 items-center">
                    <SignUpButton handleSignUp={() => setSignUpModalOpen(true)} />
                    <LoginButton handleLogin={() => setLoginModalOpen(true)} />
                    <div
                      className="border-2 p-2 border-black rounded-md hover:bg-yellow-400 cursor-pointer"
                      onClick={() => setLanguageModalOpen(true)}
                    >
                      <Languages />
                    </div>
                  </div>
                </nav>

                {/* Mobile Menu */}
                <div className="md:hidden flex items-center">
                  <button
                    onClick={()=>setSignUpModalOpen(true)}
                    className="p-2 rounded-md text-gray-600 hover:text-yellow-400 hover:bg-gray-100 transition"
                  >Sign Up
                  </button>
                  <button
                    onClick={()=>setLoginModalOpen(true)}
                    className="p-2 rounded-md text-gray-600 hover:text-yellow-400 hover:bg-gray-100 transition"
                  >Log in
                  </button>
                </div>
              </div>
            </div>
          </header>

          <Hero/>

          <Hero1/>
        </div>
        <Hero3 winners={winners} />
        <Hero4 courses={courses}/>
        <Hero2/>
      </div>
      <Footer/>
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
      {isLanguageModalOpen && (
        <LanguageSelectModal
          setLanguageModalOpen={setLanguageModalOpen}
        />
      )}
    </>
  );
};

export default LandingPage;

