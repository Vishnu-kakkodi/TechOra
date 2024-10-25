import React, { useState } from 'react';
import { useFormik } from 'formik';
import { User } from '../../types/userTypes';
import Modal from './modal';



interface SignUpModalProps {
  setModalOpen: (open: boolean) => void
}


const SignUpModal: React.FC<SignUpModalProps> = ({ setModalOpen }) => {

  const formik = useFormik<User>({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: ''
    },
    onSubmit: values => {
      console.log('Form Submitted:', values);
      setModalOpen(false);
    },
  });

  return (
    <div className="container mx-auto my-10">



      <Modal onClose={() => setModalOpen(false)}>
        <form onSubmit={formik.handleSubmit} className=" w-[600px] p-8 bg-deepPurple rounded-lg shadow-lg mx-auto">
          <h2 className="text-2xl mb-6 text-center text-white font-bold text-gray-700">Sign Up</h2>

          <label htmlFor="userName" className="text-white block text-gray-700">Username<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span></label>
          <input
            id="userName"
            name="userName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.userName}
            className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          <label htmlFor="email" className="text-white block text-gray-700">Email<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span></label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          <label htmlFor="password" className="text-white block text-gray-700">Password<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span></label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          <label htmlFor="confirmPassword" className="text-white block text-gray-700">Confirm Password<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span></label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          <label htmlFor="phoneNumber" className="text-white block text-gray-700">Phone Number<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span></label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            onChange={formik.handleChange}
            value={formik.values.phoneNumber}
            className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          <button type="submit" className="w-[50] bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-full"            >
            Submit Now
          </button>
        </form>
      </Modal>

    </div>
  );

};

export default SignUpModal;
