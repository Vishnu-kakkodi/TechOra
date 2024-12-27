import React, {useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../store/slices/userSlice';

interface ForgotPassword{
    email:string;
    password:string
}

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [forgotPassword] = useForgotPasswordMutation();

  useEffect(() => {
    if (!email) {
      toast.error('Please complete OTP verification first');
      navigate('/login');
    }
  }, [email, navigate]);

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, 'Password must contain at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const body:ForgotPassword = {
            email:email,
            password:values.confirmPassword
        }
        const res = await forgotPassword(body);
        toast.success('Password reset successful!');
        navigate('/');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Password reset failed. Please try again.';
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <h1 className='text-center text-[25px]'>Forgot Password</h1>
          <div className="rounded-md shadow-sm space-y-4">
          <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                New Password<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                value={email}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password<span className="text-red-500">*</span>
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                onChange={formik.handleChange}
                value={formik.values.newPassword}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          <div className="password-requirements mt-4 text-sm text-gray-600">
            <p className="font-medium mb-2">Password must contain:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>At least 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;