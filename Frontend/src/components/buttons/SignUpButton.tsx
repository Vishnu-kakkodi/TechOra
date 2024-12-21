

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { LoginCredentials } from '../../store/slices/sliceTypes';

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

  // const handleLogin = async () => {
  //   try {
  //     const credentials: LoginCredentials = {     
  //       email: 'johndoe@example.com',
  //       password: 'password123'
  //     };

  //     if (setModalOpen) {
  //       setModalOpen(false); 
  //     }
  //   } catch (err) {
  //     if (setModalOpen) {
  //       setModalOpen(true); 
  //     }
  //   }
  // };

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

export default SignUpButton;
