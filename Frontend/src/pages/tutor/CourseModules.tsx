




import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  GripVertical,
  Video
} from 'lucide-react';
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import { useCreateModuleMutation } from '../../store/slices/tutorSlice';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoFile: File | null;
  videoPreview: string;
}

interface FormValues {
  modules: Module[];
}

const ModuleSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  duration: Yup.number()
    .required('Duration is required')
    .min(1, 'Duration must be at least 1 minute')
});

const CourseModules = () => {
  const location = useLocation();
  const { draftId } = location.state || {}
  console.log('Received draftId:', draftId);
  const navigate = useNavigate();
  const [createModule] = useCreateModuleMutation();

  const initialValues: FormValues = {
    modules: [
      {
        id: '1',
        title: '',
        description: '',
        duration: '',
        videoFile: null,
        videoPreview: ''
      }
    ]
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const moduleUploads = values.modules.map(async (module, index) => {
        const moduleFormData = new FormData();
        moduleFormData.append('draftId', draftId);
        moduleFormData.append('moduleIndex', index.toString());
        moduleFormData.append('title', module.title);
        moduleFormData.append('description', module.description);
        moduleFormData.append('duration', module.duration);

        if (module.videoFile) {
          moduleFormData.append('video', module.videoFile);
        }

        const response = await createModule({
          body: moduleFormData
        }).unwrap();
        return response;
      });

      const results = await Promise.all(moduleUploads);

      console.log('All modules uploaded successfully:', results);

      navigate('/tutor/courses')

    } catch (error) {
      console.error('Error creating modules:', error);
    }
  };

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue(`modules.${index}.videoFile`, file);
      setFieldValue(`modules.${index}.videoPreview`, URL.createObjectURL(file));
    }
  };

  return (
    <div className='flex'>
      <TutorSidebar />
      <div className="p-6 w-[800px] mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Course Modules</h1>
            <p className="text-gray-500">Add modules and upload video content</p>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            modules: Yup.array().of(ModuleSchema)
          })}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-6">
              <FieldArray name="modules">
                {({ push, remove }) => (
                  <>
                    {values.modules.map((module, index) => (
                      <div
                        key={module.id}
                        className="bg-white p-6 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                            <h3 className="text-lg font-semibold">Module {index + 1}</h3>
                          </div>
                          {values.modules.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-1 hover:bg-gray-100 rounded-full"
                            >
                              <X className="h-5 w-5 text-gray-500" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Module Title
                            </label>
                            <Field
                              name={`modules.${index}.title`}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter module title"
                            />
                            {errors.modules?.[index]?.title && touched.modules?.[index]?.title && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.modules[index].title}
                              </div>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor={`modules.${index}.duration`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Duration (minutes)
                            </label>
                            <Field
                              id={`modules.${index}.duration`}
                              name={`modules.${index}.duration`}
                              type="number"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-transparent
                 [appearance:textfield] 
                 [&::-webkit-outer-spin-button]:appearance-none 
                 [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="Enter duration in minutes"
                            />
                            {errors.modules?.[index]?.duration &&
                              touched.modules?.[index]?.duration && (
                                <div className="text-red-500 text-sm mt-1">
                                  {errors.modules[index].duration}
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Module Description
                          </label>
                          <Field
                            as="textarea"
                            name={`modules.${index}.description`}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter module description"
                          />
                          {errors.modules?.[index]?.description && touched.modules?.[index]?.description && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.modules[index].description}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Video Content
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            {module.videoPreview ? (
                              <div className="relative w-full">
                                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
                                  <Video className="h-8 w-8 text-gray-400 mr-2" />
                                  <span className="text-gray-600">
                                    {module.videoFile?.name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFieldValue(`modules.${index}.videoFile`, null);
                                    setFieldValue(`modules.${index}.videoPreview`, '');
                                  }}
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
                                    <span>Upload a video</span>
                                    <input
                                      type="file"
                                      className="sr-only"
                                      accept="video/*"
                                      onChange={(e) => handleVideoChange(e, setFieldValue, index)}
                                    />
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => push({
                        id: Date.now().toString(),
                        title: '',
                        description: '',
                        duration: '',
                        videoFile: null,
                        videoPreview: ''
                      })}
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add New Module
                    </button>
                  </>
                )}
              </FieldArray>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Modules
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CourseModules;