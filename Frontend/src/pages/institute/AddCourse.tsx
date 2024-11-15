import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hook';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  ArrowLeft,
  Upload,
  X
} from 'lucide-react';
import { useCreateCourseMutation } from '../../store/slices/institutionSlice';
import { RootState } from '../../store';

// Interfaces
interface CourseFormValues {
  title: string;
  department: string;
  instructor: string;
  duration: string;
  description: string;
  startDate: string;
  price: string;
  status: 'draft' | 'published';
  thumbnail: File | null;
}

interface ErrorProps {
  children: React.ReactNode;
}

// Validation Schema
// const validationSchema: Yup.ObjectSchema<Partial<CourseFormValues>> = Yup.object({
//   title: Yup.string()
//     .required('Course title is required')
//     .min(3, 'Title must be at least 3 characters'),
//   department: Yup.string()
//     .required('Department is required'),
//   instructor: Yup.string()
//     .required('Instructor name is required'),
//   duration: Yup.string()
//     .required('Duration is required')
//     .test('is-positive-integer', 'Duration must be a positive integer', (value) => {
//       if (!value) return false;
//       const num = Number(value);
//       return Number.isInteger(num) && num > 0;
//     }),
//   description: Yup.string()
//     .required('Course description is required')
//     .min(20, 'Description must be at least 20 characters'),
//   startDate: Yup.date()
//     .required('Start date is required')
//     .min(new Date(), 'Start date must be in the future'),
//   price: Yup.string()
//     .required('Price is required')
//     .test('is-non-negative', 'Price cannot be negative', (value) => {
//       if (!value) return false;
//       return Number(value) >= 0;
//     }),
//   thumbnail: Yup.mixed<File>()
//     .test('fileSize', 'File size must be less than 10MB', (value) => {
//       if (!value) return true;
//       return value.size <= 10 * 1024 * 1024; // 10MB
//     })
//     .test('fileType', 'Unsupported file type', (value) => {
//       if (!value) return true;
//       return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
//     })
// });

// Error Message Component
const ErrorText = ({ children }: { children: React.ReactNode }) => (
  <div className="text-red-500 text-sm mt-1">{children}</div>
);

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [createCourse] = useCreateCourseMutation();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  const institutionInfo = useAppSelector((state) => state.auth.institutionInfo);
  console.log(institutionInfo?._id);
  


  const initialValues: CourseFormValues = {
    title: '',
    department: '',
    instructor: '',
    duration: '',
    description: '',
    startDate: '',
    price: '',
    status: 'draft',
    thumbnail: null
  };

  const handleSubmit = async (
    values: CourseFormValues,
    { setSubmitting }: FormikHelpers<CourseFormValues>
): Promise<void> => {
    try {
        setSubmitError(''); 
        const formData = new FormData();
        
        // Append all non-file fields
        Object.entries(values).forEach(([key, value]) => {
            if (key !== 'thumbnail' && value !== null && value !== undefined) {
                formData.append(key, value.toString());
            }
        });
        
        // Append the file last
        if (values.thumbnail instanceof File) {
            formData.append('thumbnail', values.thumbnail);
        }

        if (institutionInfo?._id) {
          formData.append('institutionId', institutionInfo._id);
        }else{
          console.log("Id not")
        }

        const response = await createCourse({
            body: formData
        }).unwrap();

        console.log('Course created successfully:', response);
        navigate('/institute/upload-videos');
    } catch (error: any) {
        console.error('Failed to create course:', error);
        setSubmitError(error.message || 'An unexpected error occurred');
    } finally {
        setSubmitting(false);
    }
};
  const handleImageChange = (
    setFieldValue: (field: string, value: any) => void,
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue('thumbnail', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (setFieldValue: (field: string, value: any) => void): void => {
    setFieldValue('thumbnail', null);
    setPreviewUrl('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/courses')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          type="button"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Add New Course</h1>
          <p className="text-gray-500">Create a new course and add details</p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, errors, touched }) => (
          <Form className="space-y-8">
            {/* Course Thumbnail */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course Thumbnail
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-48 w-96 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(setFieldValue)}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="thumbnail"
                          className="sr-only"
                          accept="image/*"
                          onChange={(event) => handleImageChange(setFieldValue, event)}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
              {touched.thumbnail && errors.thumbnail && (
                <ErrorText>{errors.thumbnail as string}</ErrorText>
              )}
            </div>

            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title
                  </label>
                  <Field
                    type="text"
                    name="title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
                  <ErrorMessage name="fieldName">
                    {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                  </ErrorMessage>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <Field
                    as="select"
                    name="department"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="business">Business</option>
                    <option value="hotel-management">Hotel Management</option>
                  </Field>
                  <ErrorMessage name="fieldName">
                    {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                  </ErrorMessage>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor Name
                  </label>
                  <Field
                    type="text"
                    name="instructor"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter instructor name"
                  />
                  <ErrorMessage name="fieldName">
                    {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                  </ErrorMessage>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (weeks)
                  </label>
                  <Field
                    type="number"
                    name="duration"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter duration in weeks"
                  />
                  <ErrorMessage name="fieldName">
                    {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                  </ErrorMessage>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course description"
                  />
                  <ErrorMessage name="fieldName">
                    {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                  </ErrorMessage>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <Field
                      type="date"
                      name="startDate"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ErrorMessage name="fieldName">
                      {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Fee ($)
                    </label>
                    <Field
                      type="number"
                      name="price"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter course fee"
                    />
                    <ErrorMessage name="fieldName">
                      {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                    </ErrorMessage>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCourse;