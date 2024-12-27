import React, { ChangeEvent, useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  Edit,
  Save,
  Trash2,
  PlusCircle,
  X,
  Upload,
  Delete
} from 'lucide-react';
import ProfilePhoto from '../../assets/frontEnd/ProfilePic.png'
import { useNavigate, useParams } from 'react-router-dom';
import ModuleEditModal from './ModuleEditor';
import { useAppSelector } from '../../store/hook';
import { toast } from 'react-toastify';
import { useCoursedetailQuery, useModuleDeleteMutation, useUpdateCourseMutation } from '../../store/slices/tutorSlice';
import TutorSidebar from '../../components/sidebar/tutorSidebar';


interface CourseFormValues {
  title: string;
  department: string;
  instructor: string;
  duration: string;
  description: string;
  startDate: string;
  price: string | number;
  status: 'draft' | 'published';
}

const EditCourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const institutionInfo = useAppSelector((state) => state.auth.institutionInfo);

  const [updateCourse] = useUpdateCourseMutation();
  const [moduleDelete] = useModuleDeleteMutation();


  const validationSchema = Yup.object().shape({
    thumbnail: Yup.mixed().nullable(),
    title: Yup.string().required('Course title is required'),
    department: Yup.string().required('Department is required'),
    duration: Yup.string().required('Duration is required'),
    description: Yup.string().required('Description is required'),
  });


  const navigate = useNavigate();

  const { data: courseData, isLoading, isError } = useCoursedetailQuery(courseId as string);

  console.log(courseData, "Datasasa")
  const course = courseData?.Data;

  useEffect(() => {
    if (course?.thumbnail) {
      setPreviewUrl(course.thumbnail);
    }
  }, [course]);

  const [coursedata, setCourseData] = useState(() => {
    course
  });

  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    duration: '',
    video: null
  });

  const handleInputChange = (e: any, field: any) => {
    setCourseData((prev: any) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // const handleModuleChange = (index: any, field: any, value: any) => {
  //   const updatedModules = [...course?.modules];
  //   updatedModules[index][field] = value;
  //   setCourseData((prev: any) => ({
  //     ...prev,
  //     modules: updatedModules
  //   }));
  // };

  const handleAddModule = () => {
    if (newModule.title && newModule.description) {
      setCourseData((prev: any) => ({
        ...prev,
        modules: [...prev.modules, {
          id: prev.modules.length + 1,
          ...newModule
        }]
      }));
      setNewModule({
        title: '',
        description: '',
        duration: '',
        video: null
      });
    }
  };

  const handleRemoveModule = (index: any) => {
    setCourseData((prev: any) => ({
      ...prev,
      modules: prev.modules.filter((_: any, i: any) => i !== index)
    }));
  };

  const toggleModule = (moduleId: any) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
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


  const handleEditClick = (module:any) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const handleDelete = async (moduleId:any) => {
    try{
      if(course?._id){
        let courseId = course?._id
        await moduleDelete({moduleId,courseId})
        toast.success("Module Deleted");
      }

    }catch(error){

    }
  };

  const handleSaveModule = (updatedModule:any) => {
    // Implement module update logic
  };

  const handleSubmit = async (values: CourseFormValues): Promise<void> => {
    try {
      setSubmitError('');

      let id:string|undefined = course?._id


      const response = await updateCourse({values,id}).unwrap();

      console.log('Course updated successfully:');
      toast.success(response.message)
      navigate('/tutor/courses');
    } catch (error: any) {
      console.error('Failed to create course:', error);
      setSubmitError(error.message || 'An unexpected error occurred');
    } 
  };

  return (
    <div className='flex'>
      <TutorSidebar />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Formik
            initialValues={{
              title: course?.title || '',
              department: course?.department || '',
              duration: course?.duration || '',
              description: course?.description || '',
              price: course?.price || '',
              instructor: course?.tutorId?.tutorname || '', 
              startDate: course?.startDate || '', 
              status: course?.status || 'draft',  

            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ setFieldValue, values, errors, touched }) => (
              <Form>
                <div className="lg:col-span-2">

                  <div className="mb-6">
                    <div className="mb-4 mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                      <Field
                        type="text"
                        name="title"
                        placeholder="Enter the course title"
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <Field
                          type="text"
                          name="department"
                          placeholder="Enter the department"
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex flex-col w-full sm:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <Field
                          type="text"
                          name="duration"
                          placeholder="Enter the duration"
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <Field
                        as="textarea"
                        name="description"
                        className="w-full border rounded px-2 py-1"
                        rows={4}
                        placeholder="Provide a brief description of the course"
                      />
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
                    </div>

                    <button
                      type="submit"
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Update Course
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Course Modules Updation</h2>
                <button
                  onClick={() => navigate('/tutor/upload-videos', { state: { draftId: course?._id } })}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Module
                </button>
            </div>

            <div className="h-96 space-y-4">
              {course?.modules.map((module, index) => (
                <div
                  key={module._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setActiveModule(activeModule === module._id ? null : module._id)}
                  >
                    <div className="flex justify-between items-center">
                      {/* Module Title */}
                      <div className="flex items-center space-x-4">
                        <h3 className="font-medium">
                          Module {index + 1}: {module.title}
                        </h3>
                      </div>
                      <div>
                        
                      <button onClick={() => handleDelete(module._id )}>
                        <Trash2 className="w-5 h-5 mr-2" />
                      </button>

                      <button onClick={() => handleEditClick(module)}>
                        <Edit className="w-5 h-5" />
                      </button>
                      </div>
                    </div>
                  </div>

                  <ModuleEditModal
                    module={selectedModule}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveModule}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditCourseDetail;

