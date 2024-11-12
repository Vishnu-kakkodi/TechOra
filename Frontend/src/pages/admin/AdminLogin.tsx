import React from 'react';
import { useFormik } from 'formik';
import { AdminTypes } from '../../types/adminTypes';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useVerifyAdminMutation } from '../../store/slices/adminSlice';
import { setAdminCredentials } from '../../store/slices/authSlice';
import * as Yup from 'yup';



const AdminLoginModal: React.FC = () => {
  const [adminLogin] = useVerifyAdminMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    adminEmail: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
      adminPassword: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik<AdminTypes>({
    initialValues: {
      adminEmail: '',
      adminPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("Mutation started");

        const response = await adminLogin(values).unwrap();
        console.log("Mutation ended");

        toast.success('Admin login successful!');
        dispatch(setAdminCredentials({ ...response.adminData }));
        navigate('/admin/dashboard');
      } catch (err) {
        console.error('Admin login error:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto ">
      <form onSubmit={formik.handleSubmit} className="w-[600px] m-[200px] p-8 bg-deepPurple rounded-lg shadow-lg mx-auto">
        <h2 className="text-2xl mb-6 text-center font-bold text-white">Admin Login</h2>

        <label htmlFor="email" className="block text-white mb-2">
          Email<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span>
        </label>
        <input
          id="adminEmail"
          name="adminEmail"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.adminEmail}
          className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
        />

        {formik.touched.adminEmail && formik.errors.adminEmail && (
          <div className="text-red-500 mb-4">{formik.errors.adminEmail}</div>
        )}

        <label htmlFor="password" className="block text-white mb-2">
          Password<span className="text-red-500 wpforms-required-label" aria-hidden="true">*</span>
        </label>
        <input
          id="adminPassword"
          name="adminPassword"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.adminPassword}
          className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
        />

        {formik.touched.adminPassword && formik.errors.adminPassword && (
          <div className="text-red-500 mb-4">{formik.errors.adminPassword}</div>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            className="h-[35px] bg-yellow-500 hover:bg-yellow-600 text-black pl-2 pr-2 rounded-[5px]"
            disabled={formik.isSubmitting}
          >
            Submit Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLoginModal;
