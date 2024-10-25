import React from 'react';
import { useFormik } from 'formik';
import { UserLogin } from '../../types/userTypes';
import Modal from './modal'



interface LoginModalProps{
    setLoginModal:(open: boolean)=>void
}

const LoginModal: React.FC<LoginModalProps> = ({ setLoginModal }) => {

    const formik = useFormik<UserLogin>({
      initialValues: {
        email: '',
        password: '',
      },
      onSubmit: values => {
        console.log('Form Submitted:', values);
        setLoginModal(false);
      },
    });
  
    return (
      <div className="container mx-auto my-10">
        <Modal onClose={() => setLoginModal(false)}>
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
  
            <button type="submit" className="w-[50] bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-full"            >
              Submit Now
            </button>
          </form>
        </Modal>
      </div>
    );
  };
  
  export default LoginModal;
  