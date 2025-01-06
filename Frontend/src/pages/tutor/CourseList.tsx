import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import InstituteFooter from '../../components/footer/InstituteFooter';
import useDebouncedValue from '../../hooks/debounceHook';
import { useCourseListQuery, useListCourseMutation } from '../../store/slices/tutorSlice';
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import { CourseDocument } from 'src/types/courseType';

const CourseList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeDropdowns, setActiveDropdowns] = useState<{ [key: string]: boolean }>({});
  const [listCourse] = useListCourseMutation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const debouncedSearchTerm = useDebouncedValue(search, 500);

  const {
    data: courseData,
    isLoading,
    error
  } = useCourseListQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    filter,
    sort
  });

  const course = courseData?.course || [];
  const total = courseData?.total || 0;
  const courseCategories = courseData?.department || [];
  const totalCourse = courseData?.totalCourse || 0;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filter]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPage(1);
    setSearch(value);
  };

  const handleEdit = (courseId: string) => {
    navigate(`/tutor/courses/edit/${courseId}`);
  };

  const handleView = (courseId: string) => {
    if (course) {
      console.log("User list fetched successfully:", course);
      navigate(`/tutor/course-view/${courseId}`, { state: { courseId: courseId } });
    } else {
      console.error("Error fetching course list:");
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      const response:any = await listCourse({ courseId });
      toast.success(response?.data?.message)
    } catch (error) {
      toast.error("Error ocured")
    }
    console.log('Delete course:', courseId);
  };

  const toggleDropdown = (courseId: string) => {
    setActiveDropdowns(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className='flex'>
      <TutorSidebar />
      <div className='w-full'>
        <div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Course List</h1>
              </div>
              <button
                onClick={() => navigate('/tutor/course-add')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Course
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-0">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

{course.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">List?Unlist</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {course.map((courseItem: CourseDocument) => (
                    <tr key={courseItem?._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={courseItem?.thumbnail} 
                              alt={courseItem?.title} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{courseItem?.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {courseItem?.tutorId?.tutorname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {courseItem?.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {courseItem?.duration} Weeks
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          courseItem?.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {courseItem?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleView(courseItem._id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleEdit(courseItem._id)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <Edit2 className="h-4 w-4 mr-1" /> Edit
                          </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleDelete(courseItem._id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Unlist
                          </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {search 
                  ? `No courses match "${search}"` 
                  : "You haven't added any courses yet"
                }
              </p>
              <button 
                onClick={() => navigate('/tutor/course-add')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create New Course
              </button>
            </div>
          )}
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page * limit >= total}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(page - 1) * limit + 1}</span>{' '}
                  to{' '}
                  <span className="font-medium">{Math.min(page * limit, total)}</span>{' '}
                  of{' '}
                  <span className="font-medium">{total}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    {page}
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page * limit >= total}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;