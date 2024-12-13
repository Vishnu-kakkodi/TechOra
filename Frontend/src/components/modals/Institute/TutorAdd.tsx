// import React from 'react';
// import Modal from '../Modal';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useCreateTutorMutation } from '../../../store/slices/institutionSlice';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../store';
// import { toast } from 'react-toastify';

// interface CreateTutorProps {
//   setTutorAdd: (open: boolean) => void;
//   instituteId?: string; 
// }

// const TutorAdd: React.FC<CreateTutorProps> = ({ setTutorAdd, instituteId }) => {
//   const validationSchema = Yup.object({
//     department: Yup.string().required('Department is required'),
//     tutorname: Yup.string().required('Tutor name is required'),
//     education: Yup.string().required('Education is required'),
//     experiance: Yup.string().required('Experience is required'),
//     gender: Yup.string().required('Gender is required'),
//   });

//   const [createTutor] = useCreateTutorMutation();

//   const formik = useFormik({
//     initialValues: {
//       department: '',
//       tutorname: '',
//       education: '',
//       experiance: '',
//       gender: '',
//     },
//     validationSchema,
//     onSubmit: async (values, { setSubmitting }) => {
//         try {
//           const response = await createTutor({
//             data: values
//           });
//           toast.success("Tutor addded successfully")
//           setTutorAdd(false);
//         } catch (error) {
//           console.log(error);
//         } finally {
//           setSubmitting(false);
//         }
//     },
//   });
  

//   return (
//     <Modal onClose={() => setTutorAdd(false)}>
//       <div className="w-[450px] h-[650px] p-6 bg-white shadow-lg rounded-lg">
//         <h1 className="text-2xl font-bold text-center mb-6">Create Tutor</h1>
//         <form onSubmit={formik.handleSubmit}>
//           <div className="space-y-1">
//             <div>
//               <label htmlFor="department" className="block text-gray-700 font-medium mb-2">
//                 Department
//               </label>
//               <input
//                 id="department"
//                 name="department"
//                 type="text"
//                 value={formik.values.department}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   formik.errors.department && formik.touched.department
//                     ? 'border-red-500 focus:ring-red-500'
//                     : 'border-gray-300'
//                 }`}
//               />
//               {formik.errors.department && formik.touched.department && (
//                 <p className="text-red-500 text-sm mt-1">{formik.errors.department}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="tutorname" className="block text-gray-700 font-medium mb-2">
//                 Tutor Name
//               </label>
//               <input
//                 id="tutorname"
//                 name="tutorname"
//                 type="text"
//                 value={formik.values.tutorname}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   formik.errors.tutorname && formik.touched.tutorname
//                     ? 'border-red-500 focus:ring-red-500'
//                     : 'border-gray-300'
//                 }`}
//               />
//               {formik.errors.tutorname && formik.touched.tutorname && (
//                 <p className="text-red-500 text-sm mt-1">{formik.errors.tutorname}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="education" className="block text-gray-700 font-medium mb-2">
//                 Education
//               </label>
//               <input
//                 id="education"
//                 name="education"
//                 type="text"
//                 value={formik.values.education}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   formik.errors.education && formik.touched.education
//                     ? 'border-red-500 focus:ring-red-500'
//                     : 'border-gray-300'
//                 }`}
//               />
//               {formik.errors.education && formik.touched.education && (
//                 <p className="text-red-500 text-sm mt-1">{formik.errors.education}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="experiance" className="block text-gray-700 font-medium mb-2">
//                 Experience
//               </label>
//               <input
//                 id="experiance"
//                 name="experiance"
//                 type="text"
//                 value={formik.values.experiance}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   formik.errors.experiance && formik.touched.experiance
//                     ? 'border-red-500 focus:ring-red-500'
//                     : 'border-gray-300'
//                 }`}
//               />
//               {formik.errors.experiance && formik.touched.experiance && (
//                 <p className="text-red-500 text-sm mt-1">{formik.errors.experiance}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
//                 Gender
//               </label>
//               <select
//                 id="gender"
//                 name="gender"
//                 value={formik.values.gender}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   formik.errors.gender && formik.touched.gender
//                     ? 'border-red-500 focus:ring-red-500'
//                     : 'border-gray-300'
//                 }`}
//               >
//                 <option value="" disabled>
//                   Select gender
//                 </option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>
//               {formik.errors.gender && formik.touched.gender && (
//                 <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
//               )}
//             </div>

//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 mt-2 rounded-full transition-colors"
//               >
//                 Add Tutor
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default TutorAdd;




import React from 'react';
import Modal from '../Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateTutorMutation } from '../../../store/slices/institutionSlice';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

interface CreateTutorProps {
  setTutorAdd: (open: boolean) => void;
  instituteId?: string;
}

const TutorAdd: React.FC<CreateTutorProps> = ({ setTutorAdd, instituteId }) => {
  const validationSchema = Yup.object({
    department: Yup.string().required('Department is required'),
    tutorname: Yup.string().required('Tutor name is required'),
    tutorEmail: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    education: Yup.string().required('Education is required'),
    experiance: Yup.string().required('Experience is required'),
    gender: Yup.string().required('Gender is required'),
  });

  const [createTutor] = useCreateTutorMutation();

  const formik = useFormik({
    initialValues: {
      department: '',
      tutorname: '',
      tutorEmail: '',
      password: '',
      confirmPassword: '',
      education: '',
      experiance: '',
      gender: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Remove confirmPassword from the data sent to the server
        const { confirmPassword, ...submitData } = values;
        const response = await createTutor({
          data: submitData
        });
        toast.success("Tutor added successfully")
        setTutorAdd(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to add tutor");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal onClose={() => setTutorAdd(false)}>
      <div className="w-[500px] max-h-[90vh] bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create Tutor</h1>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Department Field */}
              <div>
                <label htmlFor="department" className="block text-gray-700 font-medium mb-2">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.errors.department && formik.touched.department
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.errors.department && formik.touched.department && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.department}</p>
                )}
              </div>

              {/* Tutor Name Field */}
              <div>
                <label htmlFor="tutorname" className="block text-gray-700 font-medium mb-2">
                  Tutor Name
                </label>
                <input
                  id="tutorname"
                  name="tutorname"
                  type="text"
                  value={formik.values.tutorname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.errors.tutorname && formik.touched.tutorname
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.errors.tutorname && formik.touched.tutorname && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.tutorname}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="tutorEmail" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  id="tutorEmail"
                  name="tutorEmail"
                  type="email"
                  value={formik.values.tutorEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.errors.tutorEmail && formik.touched.tutorEmail
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.errors.tutorEmail && formik.touched.tutorEmail && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.tutorEmail}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.errors.password && formik.touched.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.errors.confirmPassword && formik.touched.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
                )}
              </div>

              {/* Education Field */}
              <div>
                <label htmlFor="education" className="block text-gray-700 font-medium mb-2">
                  Education
                </label>
                <input
                  id="education"
                  name="education"
                  type="text"
                  value={formik.values.education}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.errors.education && formik.touched.education
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.errors.education && formik.touched.education && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.education}</p>
                )}
              </div>

              {/* Experience Field */}
              <div>
                <label htmlFor="experiance" className="block text-gray-700 font-medium mb-2">
                  Experience
                </label>
                <input
                  id="experiance"
                  name="experiance"
                  type="text"
                  value={formik.values.experiance}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.errors.experiance && formik.touched.experiance
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.errors.experiance && formik.touched.experiance && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.experiance}</p>
                )}
              </div>

              {/* Gender Field */}
              <div className="col-span-2">
                <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.errors.gender && formik.touched.gender
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formik.errors.gender && formik.touched.gender && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => setTutorAdd(false)}
                className="px-6 py-2 mr-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {formik.isSubmitting ? 'Adding...' : 'Add Tutor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default TutorAdd;