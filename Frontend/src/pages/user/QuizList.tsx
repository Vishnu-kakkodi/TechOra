import React, { useState } from 'react';
import { BookOpen, Clock, Star, ChevronRight, Building2, Code } from 'lucide-react';
import Navbar from '../../components/header/Navbar';
import { DifficultyLevel, TechStack, InstitutionType, Quiz, QuizFilter } from '../../types/userSide/quizType';
import { useNavigate } from 'react-router-dom';
import QuizSidebar from '../../components/sidebar/QuizSidebar';


const quizData: Quiz[] = [
  {
    id: 1,
    institution: 'Tech Academy',
    institutionType: InstitutionType.ONLINE_PLATFORM,
    title: 'React Advanced Concepts',
    description: 'Deep dive into React hooks, state management, and performance optimization',
    difficulty: DifficultyLevel.ADVANCED,
    stack: TechStack.FRONTEND,
    time: '45 mins',
    questions: 25,
    rating: 4.8
  },
  {
    id: 2,
    institution: 'Code University',
    institutionType: InstitutionType.CODING_BOOTCAMP,
    title: 'Python Data Science Fundamentals',
    description: 'Comprehensive introduction to data analysis and machine learning with Python',
    difficulty: DifficultyLevel.INTERMEDIATE,
    stack: TechStack.DATASCIENCE,
    time: '60 mins',
    questions: 30,
    rating: 4.5
  },
  {
    id: 3,
    institution: 'Global Tech Institute',
    institutionType: InstitutionType.PROFESSIONAL_TRAINING,
    title: 'Cloud Computing Essentials',
    description: 'AWS and Azure fundamentals for cloud infrastructure and deployment',
    difficulty: DifficultyLevel.BEGINNER,
    stack: TechStack.CLOUDCOMPUTING,
    time: '40 mins',
    questions: 22,
    rating: 4.3
  }
];

const QuizList: React.FC = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<QuizFilter>({
    difficulty: '',
    stack: '',
    institution: ''
  });

  const filteredQuizzes = quizData.filter(quiz => 
    (!filter.difficulty || quiz.difficulty === filter.difficulty) &&
    (!filter.stack || quiz.stack === filter.stack) &&
    (!filter.institution || quiz.institution === filter.institution)
  );

  const handleQuiz = (quiz: Quiz) =>{
    navigate('/start-quiz', { 
        state: { 
          quiz: quiz 
        } 
      });
  }

  return (
    <>
        <Navbar/>
    <div className='flex'>
        <QuizSidebar />
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Available Quizzes</h1>
      
      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <select 
          className="p-2 border rounded"
          value={filter.difficulty}
          onChange={(e) => setFilter({...filter, difficulty: e.target.value as DifficultyLevel | ''})}
        >
          <option value="">All Difficulties</option>
          {Object.values(DifficultyLevel).map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <select 
          className="p-2 border rounded"
          value={filter.stack}
          onChange={(e) => setFilter({...filter, stack: e.target.value as TechStack | ''})}
        >
          <option value="">All Stacks</option>
          {Object.values(TechStack).map(stack => (
            <option key={stack} value={stack}>{stack}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-4">
        {filteredQuizzes.map((quiz) => (
          <div 
            key={quiz.id} 
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedQuiz(quiz)}
          >
            {/* Quiz card content remains the same */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h2>
                <p className="text-gray-600 mb-3">{quiz.description}</p>
                
                <div className="flex items-center space-x-4 text-gray-500 flex-wrap">
                  <div className="flex items-center space-x-1">
                    <Building2 size={16} />
                    <span>{quiz.institution}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Code size={16} />
                    <span>{quiz.stack}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen size={16} />
                    <span>{quiz.questions} Questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{quiz.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-500" />
                    <span>{quiz.rating}/5</span>
                  </div>
                </div>
              </div>
              
              <ChevronRight className="text-blue-500" size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Details Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedQuiz.title}</h2>
            <div className="mb-6">
              <p className="text-gray-600">{selectedQuiz.description}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Institution:</span>
                  <span>{selectedQuiz.institution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Institution Type:</span>
                  <span>{selectedQuiz.institutionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Stack:</span>
                  <span>{selectedQuiz.stack}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Difficulty:</span>
                  <span>{selectedQuiz.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{selectedQuiz.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Questions:</span>
                  <span>{selectedQuiz.questions}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <button 
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={()=>handleQuiz(selectedQuiz)}
              >
                Start Quiz
              </button>
              <button 
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedQuiz(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default QuizList;