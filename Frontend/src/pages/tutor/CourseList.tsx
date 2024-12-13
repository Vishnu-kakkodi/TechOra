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

  const handleEdit = (courseId: number) => {
    navigate(`/tutor/courses/edit/${courseId}`);
  };

  const handleView = (courseId: string) => {
    if (course) {
      console.log("User list fetched successfully:", course);
      navigate('/tutor/courses-view', { state: { courseId: courseId } });
    } else {
      console.error("Error fetching course list:");
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      const response = await listCourse({ courseId });
      toast.success(response.data.message)
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

              {/* Department Filter */}
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
        </div> */}

              {/* Status Filter */}
              {/* <div className="relative">
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

            {course.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center m-7 py-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                  No Courses Found
                </h2>
                <p className="text-gray-500 mb-4">
                  {search
                    ? `No courses match "${search}"`
                    : "You haven't added any courses yet"
                  }
                </p>
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                  Search correct course
                </h2>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {course.map((course: any) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <p className="text-gray-500 text-sm">{course.department}</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(course._id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>

                        {activeDropdowns[course._id] && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <Link to={`/tutor/course-view/${course._id}`}>
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </button>
                              </Link>
                              <button
                                onClick={() => handleEdit(course._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </button>
                              <div className="border-t border-gray-200" />
                              <button
                                onClick={() => handleDelete(course._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                List/Unlist
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Instructor</span>
                        <span className="font-medium">{course.instructor}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-medium">{course.duration} Weeks</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Enrolled</span>
                        <span className="font-medium">{course.enrolled} Students</span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-500">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${course.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {course.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
        <InstituteFooter />
      </div>
    </div>
  );
};

export default CourseList;