
// import React from 'react';
// import { useFormik } from 'formik';
// import { toast } from 'react-toastify';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { useInstitutionLoginMutation } from '../../store/slices/institutionSlice';
// import { setTutorCredential } from '../../store/slices/authSlice';
// import loginPage from '../../assets/frontEnd/registerPage.jpg';
// import * as Yup from 'yup';
// import { tutorType } from '../../types/tutorType';
// import { useTutorLoginMutation } from '../../store/slices/tutorSlice';


// interface ForgotPasswordProps {
//   setModalOpen?: (state: boolean) => void;
// }

// interface ApplicationStatus {
//   status: string;
//   applicationData?: {
//     instituteName?: string;
//     submittedDate?: string;
//     currentStage?: string;
//   };
// }

// const TutorLogin: React.FC<ForgotPasswordProps> = ({ setModalOpen }) => {
  // const [login] = useTutorLoginMutation();
  // const dispatch = useDispatch();
  // const navigate = useNavigate();


//   const validationSchema = Yup.object({
//     tutorEmail: Yup.string()
//       .required('Email is required'),
//       password: Yup.string()
//       .required('Password is required'),
//   });

//   const formik = useFormik<tutorType>({
//     initialValues: {
//       tutorEmail: '',
//       password: '',
//     },
//     validationSchema,
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         const response = await login(values).unwrap();
//         dispatch(setTutorCredential(response.data));
//         navigate('/tutor/dashboard');
//       } catch (err) {
//         console.error('Tutor login error:', err);
//         toast.error('Login failed. Please check your credentials.');
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });
  
//   return (
//     <div
//       className="min-h-screen flex justify-center items-center bg-cover bg-center relative"
//       style={{ backgroundImage: `url(${loginPage})` }}
//     >
//       <div className="relative w-[600px] bg-black bg-opacity-70 rounded-lg shadow-lg p-8">
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-white">Tutor Login</h2>
//         </div>

//         <form onSubmit={formik.handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="tutorEmail" className="block text-white mb-2">
//               Email<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="tutorEmail"
//               name="tutorEmail"
//               type="email"
//               onChange={formik.handleChange}
//               value={formik.values.tutorEmail}
//               className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.errors.tutorEmail && formik.touched.tutorEmail
//                   ? 'border-red-500 ring-red-500'
//                   : 'border-gray-300 ring-indigo-300'
//                 } transition duration-200`}
//             />
//             {formik.errors.tutorEmail && formik.touched.tutorEmail && (
//               <p className="text-red-500 text-xs mt-1">{formik.errors.tutorEmail}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-white mb-2">
//               Password<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               onChange={formik.handleChange}
//               value={formik.values.password}
//               className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.errors.password && formik.touched.password
//                   ? 'border-red-500 ring-red-500'
//                   : 'border-gray-300 ring-indigo-300'
//                 } transition duration-200`}
//             />
//             {formik.errors.password && formik.touched.password && (
//               <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
//             )}
//           </div>

//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className={`h-[40px] bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-200 ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               disabled={formik.isSubmitting}
//             >
//               {formik.isSubmitting ? 'Logging in...' : 'Login'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TutorLogin;
import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { Mail, Lock, BookOpen } from 'lucide-react'
import { toast } from 'react-toastify'
import { setTutorCredential } from '../../store/slices/authSlice'
import { useTutorLoginMutation } from '../../store/slices/tutorSlice'
import { useNavigate } from 'react-router-dom'

const TutorLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [login] = useTutorLoginMutation()

  const validationSchema = Yup.object({
    tutorEmail: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })

  const formik = useFormik({
    initialValues: {
      tutorEmail: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await login(values).unwrap()
        if(response.ststus===200){
          dispatch(setTutorCredential(response.data))
        navigate('/tutor/dashboard')
        toast.success('Login successful')
        }else{
          toast.error(response.message)
        }
      } catch (err) {
        console.error('Tutor login error:', err)
        toast.error('Login failed. Please try again.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-600 text-white">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-900">Welcome Back</h1>
          <p className="mt-2 text-blue-700">Please sign in to your tutor account</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Tutor Login
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="tutorEmail"
                    name="tutorEmail"
                    type="email"
                    placeholder="Email address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.tutorEmail}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 transition-all
                      ${formik.errors.tutorEmail && formik.touched.tutorEmail
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                  />
                </div>
                {formik.touched.tutorEmail && formik.errors.tutorEmail && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.tutorEmail}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 transition-all
                      ${formik.errors.password && formik.touched.password
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                  transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* <div className="mt-6 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Forgot your password?
              </a>
            </div> */}
          </div>
        </div>

        {/* <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Don't have an account?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Sign up
            </a>
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default TutorLogin
