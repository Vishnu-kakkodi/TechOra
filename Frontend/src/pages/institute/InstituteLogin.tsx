import React, { useState } from 'react';
import { useFormik } from 'formik';
import { InstituteType } from '../../types/institutionTypes';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useVerifyAdminMutation } from '../../store/slices/adminSlice';
import { setInstituteCredentials } from '../../store/slices/authSlice';
import loginPage from '../../assets/frontEnd/registerPage.jpg'
import InstituteEmailVerify from '../../components/modals/EmailVerify';
import OtpModal from '../../components/modals/OtpModal';
import { useInstitutionLoginMutation } from '../../store/slices/institutionSlice';
import { InstituteDocument } from '../../../../Backend/src/interfaces/institute.interface';

interface ForgotPasswordProps {
  setModalOpen?: (state: boolean) => void;
}

const InstituteLogin: React.FC<ForgotPasswordProps> = ({setModalOpen}) => {
  const [emailVerify, setEmailVerify] = useState(false);
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [login] = useInstitutionLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik<InstituteType>({
    initialValues: {
      instituteEmail: '',
      collegeCode: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await login(values).unwrap();
        console.log(response.institute,"response")
        dispatch(setInstituteCredentials(response.institute));
        navigate('/institute/dashboard');
      } catch (err) {
        console.error('Institute login error:', err);
        toast.error('Login failed. Please check your credentials.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleRegister = () => {
    setEmailVerify(true);
  };

  return (
<div
  className="min-h-screen flex justify-center items-center bg-cover bg-center relative"
  style={{ backgroundImage: `url(${loginPage})` }}
>
  {/* Register button in the top-right corner */}
  <div className="absolute top-4 right-4">
    <button
      type="button"
      onClick={handleRegister}
      className="h-[40px] bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-200"
    >
      Register
    </button>
  </div>

  <div className="relative w-[600px] bg-black bg-opacity-70 rounded-lg shadow-lg p-8">
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-white">Institute Login</h2>
    </div>

    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="instituteEmail" className="block text-white mb-2">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          id="instituteEmail"
          name="instituteEmail"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.instituteEmail}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            formik.errors.instituteEmail && formik.touched.instituteEmail
              ? 'border-red-500 ring-red-500'
              : 'border-gray-300 ring-indigo-300'
          } transition duration-200`}
        />
        {formik.errors.instituteEmail && formik.touched.instituteEmail && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.instituteEmail}</p>
        )}
      </div>

      <div>
        <label htmlFor="collegeCode" className="block text-white mb-2">
          Institution ID<span className="text-red-500">*</span>
        </label>
        <input
          id="collegeCode"
          name="collegeCode"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.collegeCode}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            formik.errors.collegeCode && formik.touched.collegeCode
              ? 'border-red-500 ring-red-500'
              : 'border-gray-300 ring-indigo-300'
          } transition duration-200`}
        />
        {formik.errors.collegeCode && formik.touched.collegeCode && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.collegeCode}</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className={`h-[40px] bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-200 ${
            formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Logging in...' : 'Submit Now'}
        </button>
      </div>
    </form>
  </div>

  {emailVerify && (
    <InstituteEmailVerify
    setEmailVerify={setEmailVerify}
      setOtpModalOpen={setOtpModalOpen}
      mode='institute'
    />
  )}

  {isOtpModalOpen && <OtpModal setOtpModalOpen={setOtpModalOpen} mode='verifyEmail' />}
</div>

  );
};

export default InstituteLogin;
