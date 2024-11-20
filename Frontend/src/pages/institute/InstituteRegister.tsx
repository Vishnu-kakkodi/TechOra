import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Building2, Mail, FileText } from 'lucide-react';
import registerPage from '../../assets/frontEnd/registerPage.jpg';
import { useVerifyInstitutionMutation } from '../../store/slices/institutionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { useNavigate } from 'react-router-dom';
import { setInstituteCredentials } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

interface FormValues {
  collegeName: string;
  instituteEmail: string;
  collegeCode: string;
  country: string;
  state: string;
  district: string;
  documents: File | null;
}

const departmentOptions = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Information Technology',
];

const states = ['Kerala', 'Tamil Nadu', 'Karnataka'];
const districts = ['Thrissur', 'Ernakulam', 'Kozhikode'];

const validationSchema = Yup.object({
  collegeName: Yup.string().required('College name is required'),
  instituteEmail: Yup.string().email('Invalid email format').required('Email is required'),
  collegeCode: Yup.string().required('College code is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  district: Yup.string().required('District is required'),
  documents: Yup.mixed()
    .required('Document are required')
    .test('fileFormat', 'Only PDF files are accepted', (value) => {
      if (!value) return false;

      if (value instanceof File) {
        return value.type === 'application/pdf'
      }

      if (Array.isArray(value)) {
        return value.every(file => file.type === 'application/pdf');
      }

      return false;
    })
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return false;

      const maxSize = 5 * 1024 * 1024;
      if (value instanceof File) {
        return value.size <= maxSize;
      }

      if (Array.isArray(value)) {
        return value.every(file => file.size <= maxSize);
      }
      return false;
    })
});

const CollegeRegistration: React.FC = () => {
  const [verifyInstitution] = useVerifyInstitutionMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const institutionInfo = useAppSelector((state) => state.auth.institutionEmailInfo)
  console.log(institutionInfo,"Info")
  const formik = useFormik<FormValues>({
    initialValues: {
      collegeName: '',
      instituteEmail: institutionInfo || '',
      collegeCode: '',
      country: '',
      state: '',
      district: '',
      documents: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Mutation started...");
      const formData = new FormData();
      formData.append('collegeName', values.collegeName);
      formData.append('instituteEmail', values.instituteEmail);
      formData.append('collegeCode', values.collegeCode);
      formData.append('country', values.country);
      formData.append('state', values.state);
      formData.append('district', values.district);
      formData.append("fileType", "user_profile");
      if(values.documents) formData.append('documents',values.documents);
      try {
        const response = await verifyInstitution(formData).unwrap();
        console.log("haiiiii")
        if(response){
          toast.success("Application submit successfully")
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className="min-h-screen flex justify-center bg-gray-50 py-12 px-4"
      style={{ backgroundImage: `url(${registerPage})` }}
    >
      <div className="w-[600px] bg-black bg-opacity-50 rounded-lg shadow-lg">
        <div className="p-2 border-b border-gray-200">
          <div className="flex justify-center mb-2">
            <Building2 className="h-12 w-12 text-blue-600" />
            <h2 className="ml-2 text-white text-2xl text-center font-bold">
              College Registration
            </h2>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              College Name
            </label>
            <input
              type="text"
              {...formik.getFieldProps('collegeName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter College"
            />
            {formik.touched.collegeName && formik.errors.collegeName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.collegeName}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                {...formik.getFieldProps('instituteEmail')}
                disabled={true}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="college@example.in"
              />
              {formik.touched.instituteEmail && formik.errors.instituteEmail && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.instituteEmail}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              College Code
            </label>
            <input
              type="text"
              {...formik.getFieldProps('collegeCode')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter College Code"
            />
            {formik.touched.collegeCode && formik.errors.collegeCode && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.collegeCode}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-1">
                Country
              </label>
              <select
                {...formik.getFieldProps('country')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select country</option>
                <option value="india">India</option>
              </select>
              {formik.touched.country && formik.errors.country && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.country}</p>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-1">
                State
              </label>
              <select
                {...formik.getFieldProps('state')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state} value={state.toLowerCase()}>
                    {state}
                  </option>
                ))}
              </select>
              {formik.touched.state && formik.errors.state && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-1">
                District
              </label>
              <select
                {...formik.getFieldProps('district')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select district</option>
                {districts.map((district) => (
                  <option key={district} value={district.toLowerCase()}>
                    {district}
                  </option>
                ))}
              </select>
              {formik.touched.district && formik.errors.district && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.district}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Required Documents
            </label>
            <input
              type="file"
              accept=".pdf"
              name="documents"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                formik.setFieldValue('documents', file);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            {formik.touched.documents && formik.errors.documents && (
              <div className="text-red-500">{formik.errors.documents}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollegeRegistration;