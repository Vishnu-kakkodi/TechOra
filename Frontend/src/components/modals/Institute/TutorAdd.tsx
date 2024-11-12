import React from 'react';
import Modal from '../Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateTutorMutation } from '../../../store/slices/institutionSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface CreateTutorProps {
  setTutorAdd: (open: boolean) => void;
  instituteId?: string; 
}

const TutorAdd: React.FC<CreateTutorProps> = ({ setTutorAdd, instituteId }) => {
  const validationSchema = Yup.object({
    department: Yup.string().required('Department is required'),
    tutorname: Yup.string().required('Tutor name is required'),
    education: Yup.string().required('Education is required'),
    experience: Yup.string().required('Experience is required'),
    gender: Yup.string().required('Gender is required'),
  });

  const [createTutor] = useCreateTutorMutation();


  console.log(instituteId,"Dattttttttttttttttttttttttt")

  const formik = useFormik({
    initialValues: {
      department: '',
      tutorname: '',
      education: '',
      experience: '',
      gender: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (instituteId) { 
        try {
          const response = await createTutor({
            data: values,
            instituteId: instituteId,
          });
          setTutorAdd(false);
        } catch (error) {
          console.log(error);
        } finally {
          setSubmitting(false);
        }
      } else {
        console.log("Institute ID is missing.");
      }
    },
  });
  

  return (
    <Modal onClose={() => setTutorAdd(false)}>
      <div className="w-[450px] h-[650px] p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Create Tutor</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-1">
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
                className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.errors.department && formik.touched.department
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.errors.department && formik.touched.department && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.department}</p>
              )}
            </div>

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
                className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.errors.tutorname && formik.touched.tutorname
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.errors.tutorname && formik.touched.tutorname && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.tutorname}</p>
              )}
            </div>

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
                className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.errors.education && formik.touched.education
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.errors.education && formik.touched.education && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.education}</p>
              )}
            </div>

            <div>
              <label htmlFor="experience" className="block text-gray-700 font-medium mb-2">
                Experience
              </label>
              <input
                id="experience"
                name="experience"
                type="text"
                value={formik.values.experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.errors.experience && formik.touched.experience
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.errors.experience && formik.touched.experience && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.experience}</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.errors.gender && formik.touched.gender
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.errors.gender && formik.touched.gender && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 mt-2 rounded-full transition-colors"
              >
                Add Tutor
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TutorAdd;