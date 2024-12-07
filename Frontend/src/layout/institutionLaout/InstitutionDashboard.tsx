import React, { useState } from 'react'
import CardDisplay from '../../components/card/institutionDashboard/CustomCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TutorAdd from '../../components/modals/Institute/TutorAdd';
import { store } from '../../store';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart'
import PopularCourse from '../../pages/institute/PopularCourse';
import InstituteFooter from '../../components/footer/InstituteFooter';
import { useChartDataQuery } from '../../store/slices/institutionSlice';
import { Link } from 'react-router-dom';
import { Book, Clock, Eye } from 'lucide-react';
import { QuizDocument } from '../../types/quizType';





const InstitutionDashboard: React.FC = () => {

  const [tutorAdd, setTutorAdd] = useState(false);

  const { data = {} } = useChartDataQuery(null);
  const courses = data.course || [] as any;
  const quizzes = data.quiz || [] as any;


  console.log(data)
  const instituteData = useSelector((state: RootState) => state.auth.institutionInfo);

  console.log("kakaka")
  console.log(instituteData, "kkkjdjd")

  const handleTutor = () => {
    setTutorAdd(true)
  }

  const getDifficultyColor = (level: any) => {
    switch (level) {
        case 'easy': return 'text-green-600 bg-green-50';
        case 'medium': return 'text-yellow-600 bg-yellow-50';
        case 'hard': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
    }
};

const getStatusColor = (status: any) => {
    return status === 'published'
        ? 'text-green-600 bg-green-50'
        : 'text-yellow-600 bg-yellow-50';
};

  console.log("Current Redux Store State:", store.getState());

  return (
    <div className='bg-gray-100 w-full'>
      <h1 className="text-4xl md:text-5xl font-bold text-center py-6 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent animate-gradient relative mb-8">
        {instituteData?.collegeName}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </h1>
      <div className='flex justify-end'>
        <button onClick={handleTutor} className='bg-gold rounded-[10px] p-2 mt-10 '>Add Tutor</button>
      </div>
      <div className='flex'>
        <CardDisplay />
        <div className='border-2 border-black'>
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
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            width={500}
            height={300}
          />
        </div>
      </div>

      <h2 className="ml-4 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Latest Courses
      </h2>
      <div className='flex'>
        <div className="p-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course: any) => (
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
                      <h3 className="text-lg font-semibold line-clamp-1">{course.title}</h3>
                      <p className="text-gray-500 text-sm">{course.department}</p>
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
      </div>
      <h2 className="ml-4 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 u-2">
        Latest Quizzes
      </h2>

      <div className='flex'>
        <div className='p-6'>
          <div className='border-2 m-1'>
            <table>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stack</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quizzes.map((quiz: any) => (
                  <tr key={quiz._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-gray-900 w-[150px] overflow-hidden text-ellipsis"
                        title={quiz.title}
                      >
                        {quiz.title.length > 10
                          ? `${quiz.title.slice(0, 10)}...`
                          : quiz.title
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{quiz.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{quiz.stack}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(quiz.difficultyLevel)}`}>
                        {quiz.difficultyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {quiz.duration} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Book className="w-4 h-4 mr-1" />
                                                        {quiz.totalQuestions}
                                                    </div>
                                                </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(quiz.status)}`}>
                        {quiz.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{quiz.startDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-center"
                      >
                        <Link to={`/institute/quiz/${quiz._id}`} className="flex items-center">
                          <Eye className="w-5 h-5" />
                        </Link>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <InstituteFooter />

      {tutorAdd && (
        <TutorAdd setTutorAdd={setTutorAdd} />
      )}
    </div>


  )
};

export default InstitutionDashboard;