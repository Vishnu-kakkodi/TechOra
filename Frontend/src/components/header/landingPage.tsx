

import React, { useState } from 'react';
import SignUpButton from '../buttons/SignUpButton';
import SignUpModal from '../modals/SignUpModal';
import LoginButton from '../buttons/loginButton';
import LoginModal from '../modals/loginModal';

const LandingPageHeader = () => {
  const [isModalOpen,setModalOpen] = useState(false)
  const [isLoginModalOpen,setLoginModal] = useState(false)
  console.log(isModalOpen,"kooo")

  return (
      <>
      <header className="bg-custom-gradient shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
            <span className="text-[35px] text-yellow-500 font-bold">techOra</span>
            <span className="text-[10px] text-white block mt-0 pt-0 ml-1">Let's Build Your Future</span>
            </div>
            <nav className="flex space-x-8">
              <a
                href="#home"
                className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md 
                  text-sm font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md 
                  text-sm font-medium transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md 
                  text-sm font-medium transition-colors duration-200"
              >
                Contact
              </a>
            </nav>
            <div>
              <SignUpButton handleSignUp={() => setModalOpen(true)} />
                <LoginButton handleSignUp = {()=>setLoginModal(true)} />
            </div>
          </div>
        </div>
      </header>
      {isModalOpen && <SignUpModal setModalOpen={setModalOpen} />}
      {isLoginModalOpen && <LoginModal setLoginModal={setLoginModal} />}
      </>
  );
};

export default LandingPageHeader;