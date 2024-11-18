import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hook';
import {
  Users,
  Building2,
  Clock,
  LogOut,
  Home,
  BarChart,
  CheckCircle2,
  BookOpen,
  ClipboardList,
  PlusCircle,
  GraduationCap,
  Brain,
  FileEdit,
} from 'lucide-react';
import { useUserListQuery } from '../../store/slices/adminSlice';
import { useAppDispatch } from '../../store/hook';
import { instituteLogout } from '../../store/slices/authSlice';
import { useDraftCourseListQuery } from '../../store/slices/institutionSlice';

const InstituteSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {data: course} = useDraftCourseListQuery(null);
  const institutionInfo = useAppSelector((state) => state.auth.institutionInfo);

  const { data: users, error } = useUserListQuery(null);

  const handleDraft = async() =>{
    if (course) {
      console.log("User list fetched successfully:", course);
      navigate('/institute/course-drafts');
    } else if (error) {
      console.error("Error fetching course list:");
    }
  }

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleUserList = () => {
    if (users) {
      console.log("User list fetched successfully:", users);
      navigate('/admin/user-list');
    } else if (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const handleLogout = (): void => {
    dispatch(instituteLogout());
    navigate('/institute/login');
  };

  return (
    <div className="min-h-screen w-64 bg-gray-900 text-white">
      <div className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Institute Portal</h1>
      </div>

      <div className="p-4 border-b border-gray-800">
        <div className="mb-6 pt-5">
          <button 
            onClick={() => handleNavigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Course Management Section */}
        <div className="mb-6 space-y-4">
          <div className="text-gray-500 text-sm uppercase">
            Course Management
          </div>
          <div className="ml-5 space-y-3">
            <button 
              onClick={() => handleNavigate('/institute/courses')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <BookOpen className="w-5 h-5" />
              <span>Course List</span>
            </button>
            <button 
              onClick={() => handleNavigate('/institute/course-add')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Course</span>
            </button>
            <button 
              onClick={() => handleDraft()}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <FileEdit className="w-5 h-5" />
              <span>Draft Courses</span>
            </button>
          </div>
        </div>

        {/* Quiz Management Section */}
        <div className="mb-6 space-y-4">
          <div className="text-gray-500 text-sm uppercase">
            Quiz Management
          </div>
          <div className="ml-5 space-y-3">
            <button 
              onClick={() => handleNavigate('/quizzes')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <Brain className="w-5 h-5" />
              <span>Quiz List</span>
            </button>
            <button 
              onClick={() => handleNavigate('/institute/add-quiz')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Quiz</span>
            </button>
            <button 
              onClick={() => handleNavigate('/quizzes/drafts')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <FileEdit className="w-5 h-5" />
              <span>Draft Quizzes</span>
            </button>
          </div>
        </div>

        {/* Tutor Management Section */}
        <div className="mb-6 space-y-4">
          <div className="text-gray-500 text-sm uppercase">
            Tutor Management
          </div>
          <div className="ml-5 space-y-3">
            <button 
              onClick={() => handleNavigate('/institute/tutors')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Tutor List</span>
            </button>
            <button 
              onClick={() => handleNavigate('/institute/tutor-add')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Tutor</span>
            </button>
          </div>
        </div>

        {/* Students Section */}
        <div className="mb-6 space-y-4">
          <div className="text-gray-500 text-sm uppercase">
            Students
          </div>
          <button 
            onClick={handleUserList}
            className="flex items-center space-x-2 text-gray-300 hover:text-white ml-5"
          >
            <Users className="w-5 h-5" />
            <span>All Students</span>
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstituteSidebar;