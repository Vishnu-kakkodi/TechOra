import React, { useState } from 'react';
import { Trash2, ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Course } from '../../types/courseType';
import { useDraftCourseListQuery } from '../../store/slices/tutorSlice';
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import InstituteFooter from '../../components/footer/InstituteFooter';

const DraftCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [draftId, setDraftId] = useState("");

  const { data = {} } = useDraftCourseListQuery(null);
  const course = data.data || [];
  
  const navigate = useNavigate();

  const handleEdit = (courseId: string) => {
    navigate('/tutor/upload-videos', { state: { draftId: courseId } });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleView = () => {
    navigate('/tutor/courses-view');
  };

  const handleDelete = (courseId: number) => {
    console.log('Delete course:', courseId);
  };

  const toggleDropdown = (courseId: number) => {
    setActiveDropdown(activeDropdown === courseId ? null : courseId);
  };

  const filteredCourses = course.filter((course: Course) => course.status !== 'published');

  return (
    <div className='flex min-h-screen'>
      <TutorSidebar />
      <div className='w-full flex flex-col'>
        <div className="flex-grow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Course List</h1>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            {/* Search and filter controls here if needed */}
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses.map((course: any) => (
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
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses available</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new course.</p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/tutor/course-add')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add New Course
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <InstituteFooter />
      </div>
    </div>
  );
};

export default DraftCourses;