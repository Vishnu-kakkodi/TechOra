import React, { useState } from 'react';
import { Trash2, ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDraftCourseListQuery } from '../../store/slices/institutionSlice';

import InstituteSidebar from '../../components/sidebar/InstituteSidebar';
import { Course } from '../../types/courseType';
import InstituteFooter from '../../components/footer/InstituteFooter';

const DraftCourses = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const [draftId, setDraftId] = useState("");

  const { data = {} } = useDraftCourseListQuery(null);
  const course = data.data || [];
  console.log(course, "Datas")

  const navigate = useNavigate();
  // const [draftCourses, setDraftCourses] = React.useState([]);

  const handleEdit = (courseId: string) => {
    navigate('/institute/upload-videos', { state: { draftId: courseId } })
    console.log('Form submitted:');
  };

  const [selectedCourse, setSelectedCourse] = React.useState();
  const [isAddingModule, setIsAddingModule] = React.useState(false);
  const [newModule, setNewModule] = React.useState({ title: '', description: '' });

  // const handleAddModule = () => {
  //   if (newModule.title.trim() === '') return;

  // setDraftCourses(prevCourses => 
  //   prevCourses.map(course => {
  //     if (course.id === courseId) {
  //       return {
  //         ...course,
  //         modules: [...(course.modules || []), {
  //           id: Date.now(),
  //           title: newModule.title,
  //           description: newModule.description
  //         }]
  //       };
  //     }
  //     return course;
  //   })
  // );

  // setNewModule({ title: '', description: '' });
  // setIsAddingModule(false);
  // };

  // const handleDeleteCourse = () => {
  //   setDraftCourses(prevCourses => 
  //     prevCourses.filter(course => course.id !== courseId)
  //   );
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleView = () => {
    navigate('/institute/courses-view');
  };

  const handleDelete = (courseId: number) => {
    console.log('Delete course:', courseId);
  };

  const toggleDropdown = (courseId: number) => {
    setActiveDropdown(activeDropdown === courseId ? null : courseId);
  };

  return (

    <div className='flex'>
      <InstituteSidebar />
      <div className='w-full'>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Course List</h1>
            </div>
            <button
              onClick={() => navigate('/institute/course-add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Course
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            {/* <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div> */}

            {/* <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="appearance-none w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Departments</option>
                <option value="cs">Computer Science</option>
                <option value="math">Mathematics</option>
                <option value="business">Business</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {course.filter((course: Course) => course.status !== 'published').map((course: any) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                    <div className="text-sm text-gray-500">
                      <p>Instructor: {course.instructor}</p>
                      <p>Department: {course.department}</p>
                      <p>Last modified: {course.lastModified}</p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                    <button
                      // onClick={() => handleDeleteCourse(course.id)}
                      className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(course._id)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Continue Editing
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <InstituteFooter />
      </div>
    </div>
  );
};

export default DraftCourses;