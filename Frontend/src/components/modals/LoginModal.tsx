import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { UserLogin } from '../../types/userTypes';
import Modal from './Modal';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../store/slices/userSlice';
import { setCredentials } from '../../store/slices/authSlice';
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider } from '../../firebase/firebaseConfig';
import * as Yup from 'yup';
import { signInWithPopup, UserCredential, AuthError, GoogleAuthProvider } from 'firebase/auth';

interface LoginModalProps {
  setLoginModalOpen: (open: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ setLoginModalOpen }) => {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider as GoogleAuthProvider);
      const email = result.user.email;

      if (email) {
        setUserEmail(email);
        localStorage.setItem('email', email);
        toast.success('Google sign-in successful!');
        setLoginModalOpen(false);
        navigate('/home');
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Google sign-in error:', authError);
      toast.error(authError.message || 'Google sign-in failed. Please try again.');
    }
  };


  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must contain at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .required('Password is required'),
  });

  const formik = useFormik<UserLogin>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await login(values).unwrap();
        console.log(response.message)
        toast.success('Login successful!');
        setLoginModalOpen(false);
        dispatch(setCredentials({ ...response.user }));
        navigate('/home');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto">
      <Modal onClose={() => setLoginModalOpen(false)}>
        <form onSubmit={formik.handleSubmit} className="w-[600px] p-8 bg-deepPurple rounded-lg shadow-lg mx-auto">
          <h2 className="text-2xl mb-6 text-center font-bold text-white">Log in</h2>

          <label htmlFor="email" className="block text-white mb-2">
            Email<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 mb-4">{formik.errors.email}</div>
          )}

          <label htmlFor="password" className="block text-white mb-2">
            Password<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 mb-4">{formik.errors.password}</div>
          )}
          <label className="block text-white mb-2">Forgot Password?</label>
          <div className="flex justify-center">
            <button
              type="submit"
              className="h-[35px] bg-yellow-500 hover:bg-yellow-600 text-black pl-2 pr-2 rounded-[5px]"
              disabled={formik.isSubmitting}
            >
              Submit Now
            </button>
          </div>
          <h4 className='text-white text-center m-3'>Or</h4>
          <div className='flex justify-center'>
            <div
              onClick={handleGoogleLogin}
              className="flex items-center text-black bg-white w-[250px] h-[30px] rounded-[4px] px-2 space-x-2 cursor-pointer hover:bg-gray-100"
            >
              <FcGoogle size={20} />
              <span>Continue With Google</span>
            </div>
          </div>
          <h4 className="text-white text-center mt-7 text-[14px]">
            New To TechOra? <span className="text-pink-500 cursor-pointer">Sign Up</span>
          </h4>
        </form>
      </Modal>
    </div>
  );
};

export default LoginModal;
