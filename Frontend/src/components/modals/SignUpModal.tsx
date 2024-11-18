// import React, { useState } from 'react';
// import { useFormik } from 'formik';
// import { User } from '../../types/userTypes';
// import Modal from '../../components/modals/Modal'
// import { useNavigate } from 'react-router-dom';
// import { authService } from '../../services/authService';
// import { toast } from 'react-toastify';


// interface SignUpModalProps {
//   setModalOpen: (open: boolean) => void
// }



// const SignUpModal: React.FC<SignUpModalProps> = ({ setModalOpen }) => {

//   const navigate = useNavigate()

//   const formik = useFormik<User>({
//     initialValues: {
//       userName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       phoneNumber: ''
//     },
//     onSubmit: async (values, {setSubmitting})=>{
//       try{
//         const  registrationData = values;
//         const response = await authService.register(registrationData);

//         toast.success('Registration successful!');
//       }catch(error){
//         console.log(error,"Error")
//       }
//     }
//   });


import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User } from '../../types/userTypes';
import Modal from '../../components/modals/Modal';
import { useNavigate } from 'react-router-dom';
// import { authService } from '../../services/userApiService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import OtpModal from '../modals/OtpModal';
import { useInitiateSignupMutation } from '../../store/slices/userSlice';


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

  const formik = useFormik<User>({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setOtpModalOpen(true)
        setSignUpModalOpen(false);
        await initiateSignup(values).unwrap();
      } catch (error: any) {
        console.error(error, "Error occured");

        toast.error(error.message || 'Registration failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto">
      <Modal onClose={() => setSignUpModalOpen(false)}>
        <form onSubmit={formik.handleSubmit} className=" w-[600px] p-8 bg-white  shadow-lg mx-auto">
          <h2 className="text-2xl mb-6 text-center text-black font-bold text-gray-700">Sign Up</h2>

          <label htmlFor="userName" className="text-black block text-gray-700">Username<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span></label>
          <input
            id="userName"
            name="userName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.userName}
            className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          {formik.touched.userName && formik.errors.userName && (
            <div className="text-red-500 mb-4">{formik.errors.userName}</div>
          )}

          <label htmlFor="email" className="text-black block text-gray-700">Email<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span></label>
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

          <label htmlFor="password" className="text-black block text-gray-700">Password<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span></label>
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

          <label htmlFor="confirmPassword" className="text-black block text-gray-700">Confirm Password<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span></label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="confirmPassword"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-red-500 mb-4">{formik.errors.confirmPassword}</div>
          )}

          <label htmlFor="phoneNumber" className="text-black block text-gray-700">Phone Number<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span></label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            onChange={formik.handleChange}
            value={formik.values.phoneNumber}
            className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="text-red-500 mb-4">{formik.errors.phoneNumber}</div>
          )}
          <div className="flex justify-center">
            <button type="submit" className="w-[50] bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-[10px]"            >
              Submit Now
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );

};

export default SignUpModal;
