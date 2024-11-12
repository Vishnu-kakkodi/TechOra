import React, { useState } from 'react';
import SignUpButton from '../buttons/SignUpButton';
import SignUpModal from '../modals/SignUpModal';
import LoginButton from '../buttons/LoginButton';
import LoginModal from '../modals/LoginModal';
import TutorButton from '../buttons/TutorLogin';
import SearchBar from "../search/SearchBar";
import OtpModal from '../modals/OtpModal';
import EmailVerify from '../modals/EmailVerify';

const LandingPageHeader = () => {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isEmailVerifyOpen, setEmailVerifyOpen] = useState(false);
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);

  const [otpMode, setOtpMode] = useState<'signup' | 'verifyEmail' | 'forgotPassword'>('signup');

  const searchData = ["Course", "Quiz"];

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
      <header className="bg-custom-gradient shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-[35px] text-yellow-500 font-bold">techOra</span>
              <span className="text-[10px] text-white block mt-0 pt-0 ml-1">Let's Build Your Future</span>
            </div>
            <SearchBar data={searchData} />

            <nav className="flex space-x-8">
              <a className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Course
              </a>
              <a className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Quiz
              </a>
              <a className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Resources
              </a>
              <a className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                About
              </a>
            </nav>
            <div>
              <SignUpButton handleSignUp={() => setSignUpModalOpen(true)} />
              <LoginButton handleLogin={() => setLoginModalOpen(true)} />
            </div>
          </div>
        </div>
      </header>

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

export default LandingPageHeader;