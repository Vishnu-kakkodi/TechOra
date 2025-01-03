
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { PlusCircle, BookOpen, GraduationCap, Users, Clock, LineChart } from 'lucide-react';
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useRecentActivityQuery } from '../../store/slices/tutorSlice';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  const tutorData = useSelector((state: RootState) => state.auth.tutorInfo);

  const { data: recentActivity } = useRecentActivityQuery(null);

  const activity = recentActivity?.data;

  console.log(activity);



  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <TutorSidebar />

      <main className="flex-1 p-8">
        <div className='flex justify-between'>
          <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {tutorData?.tutorname}</h1>
            <p className="text-gray-600">Manage your courses and track student progress</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link to='/tutor/course-add'>
          <button className="border border-gray-300 p-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <PlusCircle className="h-5 w-5" />
            Create New Course
          </button>
          </Link>
          <Link to='/tutor/add-quiz'>
          <button className="border border-gray-300 p-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <PlusCircle className="h-5 w-5" />
            Create New Quiz
          </button>
          </Link>
        </div>
          </div>
          <div>
            <img className='h-[200px] w-[200px] border-2 mb-8 rounded-full'
              src={tutorData?.profilePic}
              alt={tutorData?.tutorname}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Courses</h3>
              <BookOpen className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">1</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Draft Courses</h3>
              <BookOpen className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">0</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Quizzes</h3>
              <GraduationCap className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">2</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Draft Quizzes</h3>
              <GraduationCap className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">0</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          {activity && (
            activity.map((act: any, index: number) => (
              <div className="p-6" key={index}>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{act.type}</p>
                      <p className="text-sm text-gray-500">{act.title}</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">{formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}</div>
                  </div>
                </div>
              </div>
            ))
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;