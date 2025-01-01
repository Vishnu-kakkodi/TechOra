import React, { useState } from 'react';
import SignUpModal from '../modals/SignUpModal';
import LoginModal from '../modals/LoginModal';
import OtpModal from '../modals/OtpModal';
import EmailVerify from '../modals/EmailVerify';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

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

interface SignUpButtonProps {
  label?: string;
  className?: string;
  handleSignUp?: () => void; 
  setModalOpen?: (state: boolean) => void; 
}

const SignUpButton: React.FC<SignUpButtonProps> = ({ 
  label = 'Login', 
  className = '', 
  handleSignUp, 
  setModalOpen 
}) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      
      {handleSignUp && (
        <button
          onClick={handleSignUp}
          className={`ml-4 text-[14px] font-medium capitalize text-white bg-black border-2 border-black hover:bg-yellow-500 hover:text-black px-[30px] py-[11px]`}>
          Sign Up
        </button>
      )}
    </>
  );
};

const LandingPageHeader = () => {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isEmailVerifyOpen, setEmailVerifyOpen] = useState(false);
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);

  const [otpMode, setOtpMode] = useState<'signup' | 'verifyEmail' | 'forgotPassword'>('signup');

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