import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Quiz } from '../../types/userSide/quizType';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}



const QuizAttempt: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const quizFromState = location.state?.quiz;
    if (!quizFromState) {
      navigate('/quiz-list');
      return;
    }
    setQuiz(quizFromState);
  }, [location, navigate]);
  
  const questions: Question[] = [
    {
      id: 1,
      text: 'What is the primary purpose of React hooks?',
      options: [
        'To manage state in functional components',
        'To create class components',
        'To handle HTTP requests',
        'To define CSS styles'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      text: 'Which hook is used for side effects in functional components?',
      options: [
        'useState',
        'useContext',
        'useEffect',
        'useReducer'
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      text: 'What does useState return?',
      options: [
        'A single value',
        'An array with the state value and a setter function',
        'A promise',
        'An object with state methods'
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswerSelect = (questionId: number, selectedOption: number): void => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleNextQuestion = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = (): void => {
    setSubmitted(true);
  };

  const calculateScore = (): number => {
    return questions.reduce((score, question) => {
      return selectedAnswers[question.id] === question.correctAnswer 
        ? score + 1 
        : score;
    }, 0);
  };

  if (submitted) {
    const score = calculateScore();
    const percentage = ((score / questions.length) * 100).toFixed(2);

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">{quiz?.title} - Results</h1>
        <div className="text-center">
          <div className="text-6xl font-bold mb-4 text-blue-600">{percentage}%</div>
          <div className="text-xl mb-4">
            You scored {score} out of {questions.length} questions
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <button 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => window.location.reload()}
            >
              Retake Quiz
            </button>
            <button 
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Back to Quiz List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{quiz?.title}</h1>
        <div className="text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].text}</h2>
        
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <div 
              key={index}
              className={`
                p-3 rounded-lg cursor-pointer transition 
                ${selectedAnswers[questions[currentQuestion].id] === index 
                  ? 'bg-blue-100 border-2 border-blue-500' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'}
              `}
              onClick={() => handleAnswerSelect(questions[currentQuestion].id, index)}
            >
              <div className="flex items-center">
                <div className={`
                  w-5 h-5 mr-3 rounded-full border-2 
                  ${selectedAnswers[questions[currentQuestion].id] === index 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300'}
                `}></div>
                <span>{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button 
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className={`
            flex items-center px-4 py-2 rounded-lg transition
            ${currentQuestion === 0 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50'}
          `}
        >
          <ChevronLeft className="mr-2" /> Previous
        </button>

        {currentQuestion === questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            disabled={selectedAnswers[questions[currentQuestion].id] === undefined}
            className={`
              flex items-center px-6 py-2 rounded-lg transition
              ${selectedAnswers[questions[currentQuestion].id] === undefined
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'}
            `}
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={handleNextQuestion}
            disabled={selectedAnswers[questions[currentQuestion].id] === undefined}
            className={`
              flex items-center px-4 py-2 rounded-lg transition
              ${selectedAnswers[questions[currentQuestion].id] === undefined
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50'}
            `}
          >
            Next <ChevronRight className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;