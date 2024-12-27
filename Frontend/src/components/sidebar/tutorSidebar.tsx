import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  MessageCircle
} from 'lucide-react';
import { useAppDispatch } from '../../store/hook';
import { tutorLogout } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { useDraftCourseListQuery, useTutorLogoutCallMutation } from '../../store/slices/tutorSlice';
import { FaLock, FaUserCircle } from 'react-icons/fa';

const TutorSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [tutorLogoutCall] = useTutorLogoutCallMutation();
  const { data: course, error } = useDraftCourseListQuery(null);
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  const handleLogout = async () => {
    const response = await tutorLogoutCall().unwrap();
    toast.success("Tutor Logout successfully");
    dispatch(tutorLogout());
    navigate('/tutor/login');
  };
  return (
    <div className="min-h-screen w-64 bg-gray-900 text-white">
      <div className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Tutor Portel</h1>
      </div>

      <div className="p-4 border-b border-gray-800">
        <div className="mb-6 pt-5">
          <button
            onClick={() => handleNavigate('/tutor/dashboard')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="text-gray-500 text-sm uppercase">
            Course Management
          </div>
          <div className="ml-5 space-y-3">
            <button
              onClick={() => handleNavigate('/tutor/courses')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <BookOpen className="w-5 h-5" />
              <span>Course List</span>
            </button>
            <button
              onClick={() => handleNavigate('/tutor/course-add')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Course</span>
            </button>
            <button
              onClick={() => handleNavigate('/tutor/course-drafts')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <FileEdit className="w-5 h-5" />
              <span>Draft Courses</span>
            </button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="text-gray-500 text-sm uppercase">
            Quiz Management
          </div>
          <div className="ml-5 space-y-3">
            <button
              onClick={() => handleNavigate('/tutor/quizzes')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <Brain className="w-5 h-5" />
              <span>Quiz List</span>
            </button>
            <button
              onClick={() => handleNavigate('/tutor/add-quiz')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Quiz</span>
            </button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="text-gray-500 text-sm uppercase">
            Tutor Account
          </div>
          <div className="ml-5 space-y-3">
            <button
              onClick={() => handleNavigate('/tutor/profile')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <FaUserCircle />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => handleNavigate('/tutor/change-password')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <FaLock />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="text-gray-500 text-sm uppercase">
            Communication
          </div>
          <div className="ml-5 space-y-3">
            <button
              onClick={() => handleNavigate('/tutor/chat')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat Sessions</span>
            </button>
          </div>
        </div>

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

export default TutorSidebar;