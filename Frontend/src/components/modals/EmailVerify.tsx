// import React from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import Modal from './Modal';
// import { toast } from 'react-toastify';
// import { useEmailVerifyMutation } from '../../store/slices/institutionSlice';
// import { useUserEmailVerifyMutation } from '../../store/slices/userSlice';

// interface EmailVerifyProps {
//   setEmailVerify: (open: boolean) => void;
//   setOtpModalOpen: (open: boolean) => void;
//   mode: 'institute' | 'user';
// }

// const EmailVerify: React.FC<EmailVerifyProps> = ({ 
//   setEmailVerify, 
//   setOtpModalOpen, 
//   mode
// }) => {
//   const [emailVerify] = useEmailVerifyMutation();
//   const [userEmailVerify] = useUserEmailVerifyMutation();

//   const validationSchema = Yup.object({
//     email: Yup.string()
//       .email('Invalid email address')
//       .required('Email is required'),
//   });

//   const formik = useFormik({
//     initialValues: {
//       email: '',
//     },
//     validationSchema,
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         setEmailVerify(false);
//         setOtpModalOpen(true);

//         if (mode === 'institute') {
//           await emailVerify(values).unwrap();
//         } else if (mode === 'user') {
//           await userEmailVerify(values).unwrap();
//         }
//       } catch (error: any) {
//         console.error(error, "Error occurred");
//         toast.error(error.message || 'Email verification failed. Please try again.');
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <Modal onClose={() => setEmailVerify(false)}>
//       <div className="relative w-[600px] h-[310px] bg-black bg-opacity-90 rounded-lg shadow-lg p-8">
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-white">
//             {mode === 'institute' ? 'Institute Email Verification' : 'Reset Password'}
//           </h2>
//           <p className="text-white mt-2">
//             Enter your email address to receive a verification code
//           </p>
//         </div>

//         <form onSubmit={formik.handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-white mb-2">
//               Email<span className="text-red-500">*</span>
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.email}
//               className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
//                 formik.errors.email && formik.touched.email 
//                   ? 'border-red-500 ring-red-500' 
//                   : 'border-gray-300 ring-indigo-300'
//               } transition duration-200`}
//             />
//             {formik.errors.email && formik.touched.email && (
//               <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
//             )}
//           </div>

//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="h-[40px] bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-200"
//               disabled={formik.isSubmitting}
//             >
//               Send Verification Code
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default EmailVerify



import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from './Modal';
import { toast } from 'react-toastify';
import { useEmailVerifyMutation } from '../../store/slices/institutionSlice';
import { useUserEmailVerifyMutation } from '../../store/slices/userSlice';

interface EmailVerifyProps {
  setEmailVerify: (open: boolean) => void;
  setOtpModalOpen: (open: boolean) => void;
  mode: 'institute' | 'user';
}

const EmailVerify: React.FC<EmailVerifyProps> = ({
  setEmailVerify,
  setOtpModalOpen,
  mode
}) => {
  const [emailVerify] = useEmailVerifyMutation();
  const [userEmailVerify] = useUserEmailVerifyMutation();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setEmailVerify(false);
        setOtpModalOpen(true);

        if (mode === 'institute') {
          await emailVerify(values).unwrap();
        } else if (mode === 'user') {
          await userEmailVerify(values).unwrap();
        }
      } catch (error: any) {
        console.error(error, "Error occurred");
        toast.error(error.message || 'Email verification failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto">
      <Modal onClose={() => setEmailVerify(false)}>
        {/* <div className="relative w-full max-w-[600px] h-auto min-h-[310px] bg-black bg-opacity-90 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mx-4"> */}

        <form onSubmit={formik.handleSubmit} className="space-y-6 w-[90%] sm:w-[500px] md:w-[600px] p-4 md:p-8 
                         bg-white shadow-lg mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">
              {mode === 'institute' ? 'Institute Email Verification' : 'Reset Password'}
            </h2>
            <p className="text-black mt-2 text-sm sm:text-base">
              Enter your email address to receive a verification code
            </p>
          </div>
          <div>
            <label htmlFor="email" className="block text-black text-sm sm:text-base mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.errors.email && formik.touched.email
                ? 'border-red-500 ring-red-500'
                : 'border-gray-300 ring-indigo-300'
                } transition duration-200`}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto h-[40px] bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-200"
              disabled={formik.isSubmitting}
            >
              Send Verification Code
            </button>
          </div>
        </form>
        {/* </div> */}
      </Modal>
    </div>
  );
};

export default EmailVerify;