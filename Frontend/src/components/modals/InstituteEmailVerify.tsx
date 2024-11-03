import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from './Modal';
import { toast } from 'react-toastify';
import { useEmailVerifyMutation } from '../../store/slices/institutionSlice';

interface LoginModalProps {
  setInstituteLogin: (open: boolean) => void;
  setOtpModalOpen: (open: boolean) => void;
}

const InstituteEmailVerify: React.FC<LoginModalProps> = ({ setInstituteLogin, setOtpModalOpen}) => {

    const [emailVerify] = useEmailVerifyMutation();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    collegeCode: Yup.string()
      .min(4, 'Institution ID must be at least 4 characters long')
      .required('Institution ID is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      collegeCode: '',
    },
    // validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
        try {
            setInstituteLogin(false);
            setOtpModalOpen(true)
            await emailVerify(values).unwrap();
          } catch (error: any) {
            console.error(error, "Error occured");
    
            toast.error(error.message || 'Registration failed. Please try again.');
          } finally {
            setSubmitting(false);
          }

    },
  });

  return (
    <Modal onClose={() => setInstituteLogin(false)}>
      <div className="relative w-[600px] h-[310px] bg-black bg-opacity-90 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">Institute Email Verification</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.errors.email && formik.touched.email ? 'border-red-500 ring-red-500' : 'border-gray-300 ring-indigo-300'} transition duration-200`}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="h-[40px] bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-200"
              disabled={formik.isSubmitting}
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default InstituteEmailVerify;
