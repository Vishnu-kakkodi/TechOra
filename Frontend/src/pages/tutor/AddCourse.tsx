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
import { RootState } from '../../store';
import InstituteFooter from '../../components/footer/InstituteFooter';
import { useCreateCourseMutation } from '../../store/slices/tutorSlice';
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import { useNotificationSocket } from '../../useNotificationHook';
import { toast } from 'react-toastify';
import { CourseDocument } from 'src/types/courseType';

interface CourseFormValues {
  title: string;
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

const validationSchema: Yup.ObjectSchema<CourseFormValues, Yup.AnyObject, any, "">= Yup.object({
  title: Yup.string()
    .required('Course title is required')
    .min(3, 'Title must be at least 3 characters'),
  duration: Yup.string()
    .required('Duration is required')
    .test('is-positive-integer', 'Duration must be a positive integer', (value) => {
      if (!value) return false;
      const num = Number(value);
      return Number.isInteger(num) && num > 0;
    }),
  description: Yup.string()
    .required('Course description is required')
    .min(20, 'Description must be at least 20 characters'),
  startDate: Yup.string()
    .required('Start date is required')
    .test('is-future-date', 'Start date must be in the future', (value) => {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),
  price: Yup.string()
    .required('Price is required')
    .test('is-non-negative', 'Price cannot be negative', (value) => {
      if (!value) return false;
      return Number(value) >= 0;
    }),
  status: Yup.string()
    .oneOf(['draft', 'published'] as const)
    .required('Status is required'),
    thumbnail: Yup.mixed<File>()
    .nullable()
    .default(null)
    .test('fileSize', 'File size must be less than 10MB', (value) => {
      if (!value) return true;
      return value instanceof File && value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Unsupported file type', (value) => {
      if (!value) return true;
      return value instanceof File && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    })
});

const ErrorText = ({ children }: { children: React.ReactNode }) => (
  <div className="text-red-500 text-sm mt-1">{children}</div>
);

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [createCourse] = useCreateCourseMutation();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const tutorData = useAppSelector((state) => state.auth.tutorInfo);
  const token = tutorData?.accessToken;


    const { sendNotification, isConnected } = useNotificationSocket({
      token,
      senderId: tutorData?._id,
      onNotification: (notification) => {
        console.log('Received notification:', notification);
      }
    });

  const initialValues: CourseFormValues = {
    title: '',
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

      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'thumbnail' && value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      if (values.thumbnail instanceof File) {
        formData.append('thumbnail', values.thumbnail);
      }

      if (tutorData?.institutionId) {
        formData.append('institutionId', tutorData.institutionId._id);
      }

      if (tutorData?.department) {
        formData.append('department', tutorData.department);
      }


      const response = await createCourse({
        body: formData
      }).unwrap();

      const courseData: CourseDocument | null = response?.data;


              if (courseData) {
                  if (isConnected) {
                      try {
                          await sendNotification({
                              type: 'COURSE_CREATED',
                              title: `New Course: ${values.title}`,
                              department: tutorData?.department,
                              createdBy: tutorData?._id,
                          });
                          toast.success('Course created and notification sent');
                      } catch (error) {
                          console.error('Failed to send notification:', error);
                          toast.warning('Course created but notification failed');
                      }
                  } else {
                      toast.error('Notification service is not connected. Please try again later.');
                  }
              }

      navigate('/tutor/upload-videos', { state: { draftId: response.data } });
    } catch (error: any) {
      console.error('Failed to create course:', error);
      setSubmitError(error.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };
  const handleImageChange = (
    setFieldValue: (field: string, value: File) => void,
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

  const removeImage = (setFieldValue: (field: string, value: File | null) => void): void => {
    setFieldValue('thumbnail', null);
    setPreviewUrl('');
  };

  return (
    <>
      <div className='flex'>
        <TutorSidebar />
        <div className='w-full'>
          <div className="p-6 w-[800px] mx-auto">
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/institute/courses')}
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
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, errors, touched }) => (
                <Form className="space-y-8">
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
                          </div>
                        </div>
                      )}
                    </div>
                    {touched.thumbnail && errors.thumbnail && (
                      <ErrorText>{errors.thumbnail as string}</ErrorText>
                    )}
                  </div>

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
                        {touched.title && errors.title && (
                          <ErrorText>{errors.title as string}</ErrorText>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="duration"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Duration (weeks)
                        </label>
                        <Field
                          id="duration"
                          type="number"
                          name="duration"
                          placeholder="Enter duration in weeks"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-transparent
                 [appearance:textfield] 
                 [&::-webkit-outer-spin-button]:appearance-none 
                 [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {touched.duration && errors.duration && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

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
                        {touched.description && errors.description && (
                          <ErrorText>{errors.description as string}</ErrorText>
                        )}
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
                          {touched.startDate && errors.startDate && (
                            <ErrorText>{errors.startDate as string}</ErrorText>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Fee
                          </label>
                          <Field
                            type="number"
                            name="price"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter course fee"
                          />
                          {touched.price && errors.price && (
                            <ErrorText>{errors.price as string}</ErrorText>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

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
        </div>
      </div>
    </>
  );
};

export default AddCourse;