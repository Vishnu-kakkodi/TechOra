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
import EmailVerify from './EmailVerify';
import About from '../../assets/frontEnd/About.png'
import { ApiError } from '../../types/ApiError';

interface LoginModalProps {
  setLoginModalOpen: (open: boolean) => void;
  setOtpModalOpen: (open: boolean) => void;
  onForgotPassword: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ setLoginModalOpen, setOtpModalOpen, onForgotPassword  }) => {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [emailVerify, setEmailVerify] = useState(false);

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

  const handleForgotPassword = () => {
    onForgotPassword();
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
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
        toast.success(response.message);
        setLoginModalOpen(false);
        dispatch(setCredentials({ ...response.user }));
        navigate('/home');
      } catch (error: unknown) {
        console.log(error,"Error")
        const ApiError = error as ApiError
          toast.error(ApiError.data.message)
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto">
      <Modal onClose={() => setLoginModalOpen(false)}>
          <form onSubmit={formik.handleSubmit} className="w-[600px] p-8 bg-white  shadow-lg mx-auto">
          <h2 className="text-2xl mb-6 text-center font-bold text-black">Log in</h2>

          <label htmlFor="email" className="block text-black mb-2">
            Email<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="w-full px-3 py-2 mb-4 border-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 mb-4">{formik.errors.email}</div>
          )}

          <label htmlFor="password" className="block text-black mb-2">
            Password<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-full px-3 py-2 mb-4 border-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 mb-4">{formik.errors.password}</div>
          )}
          <label className="block text-black mb-2">
            <a onClick={handleForgotPassword} className="hover:cursor-pointer hover:text-gold">Forgot Password?</a>
          </label>

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
        </form>
      </Modal>

      {emailVerify && (
        <EmailVerify
          setEmailVerify={setEmailVerify}
          setOtpModalOpen={setOtpModalOpen}
          mode="user"
        />
      )}
    </div>
  );
};

export default LoginModal;
