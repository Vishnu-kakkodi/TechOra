import React, { useState } from 'react';
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
import InstituteSidebar from '../../components/sidebar/InstituteSidebar';
import { useCourseListQuery } from '../../store/slices/institutionSlice';

const CourseList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const { data = {} } = useCourseListQuery(null);
  const course = data.data || [];
  console.log(course,"oho");
 
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (courseId: number) => {
    navigate(`/courses/edit/${courseId}`);
  };

  // const handleView = (courseId: string) => {
  //   if (course) {
  //     console.log("User list fetched successfully:", course);
  //     navigate('/institute/courses-view', {state:{courseId:courseId}});
  //   } else {
  //     console.error("Error fetching course list:");
  //   }
  // };

  const handleDelete = (courseId: number) => {
    // Implement delete functionality
    console.log('Delete course:', courseId);
  };

  const toggleDropdown = (courseId: number) => {
    setActiveDropdown(activeDropdown === courseId ? null : courseId);
  };

  return (
    <div className='flex'>
    <InstituteSidebar />
        <div className="p-6">
      {/* Header */}
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

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
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
        </div>
        
        {/* Department Filter */}
        <div className="relative">
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

        {/* Status Filter */}
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
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {course.map((course:any) => (
          <div 
            key={course.id} 
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
                    onClick={() => toggleDropdown(course.id)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {activeDropdown === course.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                      <Link to={`/institute/course-view/${course._id}`}>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </button>
                        </Link>
                        <button
                          onClick={() => handleEdit(course.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </button>
                        <div className="border-t border-gray-200" />
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.status === 'published' 
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
    </div>

  );
};

export default CourseList;