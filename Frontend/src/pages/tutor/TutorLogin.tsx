
import React from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useInstitutionLoginMutation } from '../../store/slices/institutionSlice';
import { setTutorCredential } from '../../store/slices/authSlice';
import loginPage from '../../assets/frontEnd/registerPage.jpg';
import * as Yup from 'yup';
import { tutorType } from '../../types/tutorType';
import { useTutorLoginMutation } from '../../store/slices/tutorSlice';


interface ForgotPasswordProps {
  setModalOpen?: (state: boolean) => void;
}

interface ApplicationStatus {
  status: string;
  applicationData?: {
    instituteName?: string;
    submittedDate?: string;
    currentStage?: string;
  };
}

const TutorLogin: React.FC<ForgotPasswordProps> = ({ setModalOpen }) => {
  const [login] = useTutorLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const validationSchema = Yup.object({
    tutorEmail: Yup.string()
      .required('Email is required'),
      password: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik<tutorType>({
    initialValues: {
      tutorEmail: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await login(values).unwrap();
        dispatch(setTutorCredential(response.data));
        navigate('/tutor/dashboard');
      } catch (err) {
        console.error('Tutor login error:', err);
        toast.error('Login failed. Please check your credentials.');
      } finally {
        setSubmitting(false);
      }
    },
  });
  
  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${loginPage})` }}
    >
      <div className="relative w-[600px] bg-black bg-opacity-70 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">Tutor Login</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="tutorEmail" className="block text-white mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="tutorEmail"
              name="tutorEmail"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.tutorEmail}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.errors.tutorEmail && formik.touched.tutorEmail
                  ? 'border-red-500 ring-red-500'
                  : 'border-gray-300 ring-indigo-300'
                } transition duration-200`}
            />
            {formik.errors.tutorEmail && formik.touched.tutorEmail && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.tutorEmail}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-white mb-2">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.errors.password && formik.touched.password
                  ? 'border-red-500 ring-red-500'
                  : 'border-gray-300 ring-indigo-300'
                } transition duration-200`}
            />
            {formik.errors.password && formik.touched.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`h-[40px] bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-200 ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorLogin;
