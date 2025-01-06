
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SignUpUser } from '../../types/userTypes';
import Modal from '../../components/modals/Modal';
import { toast } from 'react-toastify';
import { useInitiateSignupMutation } from '../../store/slices/userSlice';
import { ApiError } from '../../types/ApiError';

interface SignUpModalProps {
  setSignUpModalOpen: (open: boolean) => void;
  setOtpModalOpen: (open: boolean) => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ setSignUpModalOpen, setOtpModalOpen }) => {
  const [initiateSignup] = useInitiateSignupMutation();

  const validationSchema = Yup.object({
    userName: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must contain at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Password must match')
      .required("Confirm password is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
  });

  const formik = useFormik<SignUpUser>({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      profilePhoto: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setOtpModalOpen(true)
        setSignUpModalOpen(false);
        const response = await initiateSignup(values).unwrap();
        toast.success(response.message)
      } catch (error: unknown) {
        const ApiError = error as ApiError
        toast.error(ApiError.data.message)
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto">
      <Modal onClose={() => setSignUpModalOpen(false)}>
        <form onSubmit={formik.handleSubmit} 
              className="w-[90%] sm:w-[500px] md:w-[600px] p-4 md:p-8 
                         bg-white shadow-lg mx-auto">
          <h2 className="text-xl md:text-2xl mb-6 text-center font-bold text-black">
            Sign Up
          </h2>

          <div className="space-y-3 md:space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="userName" className="block text-black mb-1 md:mb-2">
                Username<span className="text-red-500">*</span>
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.userName}
                className="w-full px-3 py-2 border rounded-lg 
                          focus:outline-none focus:ring focus:ring-indigo-500"
              />
              {formik.touched.userName && formik.errors.userName && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.userName}</div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-black mb-1 md:mb-2">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full px-3 py-2 border rounded-lg 
                          focus:outline-none focus:ring focus:ring-indigo-500"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-black mb-1 md:mb-2">
                Password<span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full px-3 py-2 border rounded-lg 
                          focus:outline-none focus:ring focus:ring-indigo-500"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-black mb-1 md:mb-2">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                className="w-full px-3 py-2 border rounded-lg 
                          focus:outline-none focus:ring focus:ring-indigo-500"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-black mb-1 md:mb-2">
                Phone Number<span className="text-red-500">*</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                className="w-full px-3 py-2 border rounded-lg 
                          focus:outline-none focus:ring focus:ring-indigo-500"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-2 md:pt-4">
              <button 
                type="submit" 
                className="bg-yellow-500 hover:bg-yellow-600 
                          text-black py-2 px-6 md:px-8
                          rounded-[10px] transition-colors"
              >
                Submit Now
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SignUpModal;
