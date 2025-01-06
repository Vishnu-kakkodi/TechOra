import React, { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDraftCourseListQuery } from '../../store/slices/institutionSlice';
import InstituteSidebar from '../../components/sidebar/InstituteSidebar';
import useDebouncedValue from '../../hooks/debounceHook';
import { CourseDocument } from 'src/types/courseType';

const DraftCourses = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const debouncedSearchTerm = useDebouncedValue(search, 500);

  const [draftId, setDraftId] = useState("");

  const {
    data: courseData
  } = useDraftCourseListQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    filter,
    sort
  });

  const course = courseData?.data.course || [];
  const total = courseData?.data.total || 0;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filter]);

  const handleView = (courseId: string) => {
    if (course) {
      console.log("User list fetched successfully:", course);
      navigate(`/institute/course-view/${courseId}`, { state: { courseId: courseId } });
    } else {
      console.error("Error fetching course list:");
    }
  };


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPage(1);
    setSearch(value);
  };

  const navigate = useNavigate();

  const handleEdit = (courseId: string) => {
    navigate('/institute/upload-videos', { state: { draftId: courseId } })
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

    <div className='flex justify-start'>
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
            <div className="flex">
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

          <div className="space-y-4">
            {course.map((course: CourseDocument) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex items-center p-4"
              >
                <div className="w-48 h-32 mr-6 flex-shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow grid grid-cols-3 gap-4 items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.department}</p>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                      <span className="mr-2 text-gray-500">Instructor:</span>
                      <span className="font-medium">{course?.tutorId?.tutorname}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-500">Duration:</span>
                      <span>{course.duration} Weeks</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center mb-1">
                        <span className="mr-2 text-gray-500">Enrolled:</span>
                        <span className="font-medium">{course?.enrolledStudents} Students</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${course.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {course.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => handleView(course._id)}
                      >
                        <Eye className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

export default DraftCourses;