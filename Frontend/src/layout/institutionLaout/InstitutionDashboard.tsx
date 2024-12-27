import React, { useState } from 'react'
import CardDisplay from '../../components/card/institutionDashboard/CustomCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TutorAdd from '../../components/modals/Institute/TutorAdd';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart'
import { useChartDataQuery } from '../../store/slices/institutionSlice';
import { Book, Clock, Plus, Eye } from 'lucide-react';

const InstitutionDashboard: React.FC = () => {
  const [tutorAdd, setTutorAdd] = useState(false);

  const { data = {} } = useChartDataQuery(null);
  const courses = data.course || [];
  const quizzes = data.quiz || [];

  const instituteData = useSelector((state: RootState) => state.auth.institutionInfo);

  const handleTutor = () => {
    setTutorAdd(true)
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published'
      ? 'text-green-600 bg-green-100'
      : 'text-yellow-600 bg-yellow-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-gray-800">
              {instituteData?.collegeName}
              <span className="block h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 rounded-full"></span>
            </h1>
            <button 
              onClick={handleTutor} 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Tutor
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <CardDisplay />
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Status</h3>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: data.published, label: 'Published' },
                    { id: 1, value: data.draft, label: 'Draft' },
                    { id: 2, value: data.listed, label: 'Listed' },
                    { id: 3, value: data.unlisted, label: 'Unlisted' },
                  ],
                },
              ]}
              width={400}
              height={200}
            />
            <div className="mt-4">
              <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                  },
                ]}
                width={400}
                height={200}
              />
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course: any) => (
              <div 
                key={course._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{course.department}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Instructor</span>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration</span>
                      <span>{course.duration} Weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enrolled</span>
                      <span>{course.enrolled} Students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Quizzes</h2>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    {['Title', 'Department', 'Stack', 'Difficulty', 'Duration', 'Questions', 'Status', 'Start Date'].map((header) => (
                      <th 
                        key={header} 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quizzes.map((quiz: any) => (
                    <tr key={quiz._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="text-sm font-medium text-gray-900 max-w-[150px] overflow-hidden text-ellipsis"
                          title={quiz.title}
                        >
                          {quiz.title.length > 10 ? `${quiz.title.slice(0, 10)}...` : quiz.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{quiz.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{quiz.stack}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(quiz.difficultyLevel)}`}>
                          {quiz.difficultyLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {quiz.duration} min
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Book className="w-4 h-4 mr-2 text-gray-400" />
                          {quiz.totalQuestions}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quiz.status)}`}>
                          {quiz.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{quiz.startDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {tutorAdd && (
          <TutorAdd 
            setTutorAdd={setTutorAdd} 
            department={instituteData?.department} 
          />
        )}
      </div>
    </div>
  )
};

export default InstitutionDashboard;