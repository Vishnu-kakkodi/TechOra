

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { login } from '../../store/slices/authSlice';
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
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const handleLogin = async () => {
    try {
      const credentials: LoginCredentials = {     
        email: 'johndoe@example.com',
        password: 'password123'
      };
      await dispatch(login(credentials));

      if (setModalOpen) {
        setModalOpen(false); 
      }
    } catch (err) {
      if (setModalOpen) {
        setModalOpen(true); 
      }
    }
  };

  return (
    <>
      
      {handleSignUp && (
        <button
          onClick={handleSignUp}
          className={`ml-4 text-[14px] font-normal capitalize text-white bg-transparent border-2 border-gold hover:bg-yellow-500 hover:text-black px-[30px] py-[11px] rounded-full`}>
          Sign Up
        </button>
      )}
    </>
  );
};

export default SignUpButton;
