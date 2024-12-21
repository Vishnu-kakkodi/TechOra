



import React from 'react';
import { PlusCircle, BookOpen, GraduationCap, Users, Clock, LineChart } from 'lucide-react';
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  // const tutorData = {
  //   name: "Dr. Smith",
  //   activeCourses: 5,
  //   totalStudents: 120,
  //   upcomingQuizzes: 3
  // };

    const tutorData = useSelector((state: RootState) => state.auth.tutorInfo);


  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <TutorSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {tutorData?.tutorname}</h1>
          <p className="text-gray-600">Manage your courses and track student progress</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button className="bg-blue-600 text-white p-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <PlusCircle className="h-5 w-5" />
            Create New Course
          </button>
          <button className="border border-gray-300 p-6 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <PlusCircle className="h-5 w-5" />
            Create New Quiz
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Courses</h3>
              <BookOpen className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">25</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">50</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Upcoming Quizzes</h3>
              <GraduationCap className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">10</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Avg. Completion</h3>
              <LineChart className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">85%</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">New quiz submission</p>
                  <p className="text-sm text-gray-500">Introduction to React - Module 1 Quiz</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">2h ago</div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Course updated</p>
                  <p className="text-sm text-gray-500">Advanced JavaScript Concepts</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">5h ago</div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">New student enrolled</p>
                  <p className="text-sm text-gray-500">Web Development Fundamentals</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">1d ago</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;