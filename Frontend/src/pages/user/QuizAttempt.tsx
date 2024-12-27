import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  HelpCircle,
  Trophy,
  RefreshCcw,
  List,
  Check,
  X,
  Clock,
  AlertTriangle,
  Save
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Navbar from '../../components/header/Navbar';
import { useQuizResultMutation } from '../../store/slices/userSlice';

interface QuizOption {
  text: string;
  isCorrect: boolean;
  _id: string;
}

interface QuizQuestion {
  _id: string;
  question: string;
  options: QuizOption[];
  points: number;
  type: string;
}

interface QuizDocument {
  _id: string;
  title: string;
  duration: number;
  questions: QuizQuestion[];
  totalQuestions: number;
  passingScore: string;
  positiveScore: number;
  negativeScore: number;

}

const QuizAttempt: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [skippedQuestions, setSkippedQuestions] = useState<Record<string, boolean>>({});
  const [answered, setAnswered] = useState<number>(0)
  const [correct, setCorrect] = useState<number>(0)
  const [quizResult] = useQuizResultMutation();



  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
  };


  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizDocument | null>(null);

  useEffect(() => {
    const quizFromState = location.state?.quiz;
    if (!quizFromState) {
      navigate('/quiz-list');
      return;
    }
    setSeconds(quizFromState.duration * 60);
    setQuiz(quizFromState);
  }, [location, navigate]);

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [seconds]);

  const handleAnswerSelect = (questionId: string, selectedOptionIndex: number): void => {

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOptionIndex
    }));

    setAnsweredQuestions(prev => ({
      ...prev,
      [questionId]: true
    }));

    setSkippedQuestions(prev => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
    if (!selectedAnswers.hasOwnProperty(questionId)) {
      setAnswered(prev => prev + 1);
    }

  };

  const handleSkipQuestion = (questionId: string): void => {
    setSkippedQuestions(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleNextQuestion = (): void => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = useMemo(() => {
    if (!quiz) return 0;

    let correctCount = 0;
    const score = quiz.questions.reduce((score, question) => {
      const selectedOptionIndex = selectedAnswers[question._id];
      const isCorrect =
        selectedOptionIndex !== undefined &&
        question.options[selectedOptionIndex].isCorrect;

      if (isCorrect) {
        correctCount++;
      }

      return isCorrect
        ? score + quiz.positiveScore
        : score > 0
          ? score - quiz.negativeScore
          : score;
    }, 0);

    setCorrect(correctCount);

    return score;
  }, [quiz, selectedAnswers]) ;
  
  if (!quiz) {
    return <div>Loading...</div>;
  }

  const totalQuestions = quiz.totalQuestions;
  const unansweredQuestions = totalQuestions - answered;
  const progressPercentage = Math.round((answered / totalQuestions) * 100);

  const handleSubmit = async () => {
    if (unansweredQuestions === 0) {
      for (let i in selectedAnswers) {
        console.log(selectedAnswers[i])
      }
      const score = calculateScore;

      setSubmitted(true);
      console.log(score,"S")

      const mark = score>0 
      ? "+"+score 
      : "-"+(quiz.totalQuestions * quiz.negativeScore);
      console.log(mark,"P")

      await quizResult({
        mark: mark, 
        quizId: quiz._id
      }).unwrap();    
    }else {
      toast.warning("Complete the quiz")
    }
  };

  if (submitted) {
    const score = calculateScore;
    const passMark: number = (quiz.totalQuestions * quiz.positiveScore) * (parseInt(quiz.passingScore)) / 100
    const percentage = ((score / (quiz.totalQuestions * quiz.positiveScore)) * 100).toFixed(2);

    return (
      <QuizResults
        quiz={quiz}
        score={score}
        percentage={percentage}
        answered={answered}
        correct={correct}
        passMark={passMark}
        navigate={navigate}
      />
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Quiz Header */}
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <h1 className="text-3xl font-bold text-indigo-800">{quiz.title}</h1>
              <div className="flex items-center space-x-2 bg-indigo-100 px-3 py-1 rounded-full">
                <Clock className="text-indigo-600" size={16} />
                <span className="text-indigo-700 font-semibold">
                  {formatTime(seconds)}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-gray-600"
            >
              Question {currentQuestion + 1} of {quiz.questions.length}
            </motion.div>
          </div>

          {/* Main Quiz Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question Navigation Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                Quiz Progress
              </h3>

              {/* Progress Visualization */}
              <div className="mb-6">
                <div className="w-full bg-indigo-100 rounded-full h-3 mb-2">
                  <div
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{answered} / {totalQuestions} Answered</span>
                  <span>{progressPercentage}%</span>
                </div>
              </div>

              {/* Question Status Grid */}
              <div className="grid grid-cols-6 gap-2">
                {quiz.questions.map((question, index) => {
                  const isAnswered = answeredQuestions[question._id];
                  const isSkipped = skippedQuestions[question._id];

                  let statusClass = "bg-indigo-500 text-white";
                  let StatusIcon = HelpCircle;

                  if (isAnswered) {
                    statusClass = "bg-green-500 text-white";
                    StatusIcon = CheckCircle;
                  } else if (isSkipped) {
                    statusClass = "bg-yellow-500 text-white";
                    StatusIcon = XCircle;
                  }

                  return (
                    <motion.div
                      key={question._id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                      ${statusClass} 
                      rounded-lg p-2 flex items-center 
                      justify-center cursor-pointer 
                      hover:opacity-80 transition-all
                    `}
                      onClick={() => setCurrentQuestion(index)}
                      title={`Question ${index + 1}`}
                    >
                      <StatusIcon size={20} />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Current Question */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {currentQuestionData.question}
              </h2>

              <div className="space-y-4">
                {currentQuestionData.options.map((option, index) => (
                  <motion.div
                    key={option._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                    p-4 rounded-lg border-2 cursor-pointer 
                    transition-all duration-200 ease-in-out
                    ${selectedAnswers[currentQuestionData._id] === index
                        ? 'bg-indigo-100 border-indigo-500'
                        : 'border-gray-200 hover:border-indigo-300'}
                  `}
                    onClick={() => handleAnswerSelect(currentQuestionData._id, index)}
                  >
                    <div className="flex items-center">
                      <div className={`
                      w-6 h-6 mr-4 rounded-full border-2 
                      ${selectedAnswers[currentQuestionData._id] === index
                          ? 'bg-indigo-500 border-indigo-500'
                          : 'border-gray-300'}
                    `}></div>
                      <span className="text-gray-800">{option.text}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className={`
                  flex items-center px-6 py-3 rounded-lg 
                  transition-all duration-200
                  ${currentQuestion === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'}
                `}
                >
                  <ChevronLeft className="mr-2" /> Previous
                </motion.button>

                {currentQuestion === quiz.questions.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={selectedAnswers[currentQuestionData._id] === undefined}
                    className={`
                    flex items-center px-6 py-3 rounded-lg 
                    transition-all duration-200
                    ${selectedAnswers[currentQuestionData._id] === undefined
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                  `}
                  >
                    Submit Quiz
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextQuestion}
                    className="flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Next <ChevronRight className="ml-2" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Time Warning */}
          {seconds <= 60 && seconds > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 
              bg-yellow-100 border-2 border-yellow-300 
              px-6 py-3 rounded-lg flex items-center space-x-3"
            >
              <AlertTriangle className="text-yellow-600" />
              <span className="text-yellow-800">Hurry! Less than a minute remaining.</span>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizAttempt;


export const QuizResults = ({ quiz, score, percentage, answered, correct, passMark, navigate }: {
  quiz: any;
  score: any;
  percentage: any;
  answered: any;
  correct: any;
  passMark: any;
  navigate: any;
}) => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl  p-8 bg-white rounded-xl shadow-lg border-2"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {quiz.title} - Results
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-7xl font-bold text-blue-600 mb-2"
              >
                {percentage}%
              </motion.div>
              <p className="text-gray-600">Overall Score</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <div className="flex items-center justify-center mb-2">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{correct}</div>
              <p className="text-sm text-gray-600">Correct Answers</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <div className="flex items-center justify-center mb-2">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{answered - correct}</div>
              <p className="text-sm text-gray-600">Incorrect Answers</p>
            </div>
            {score / (quiz.totalQuestions * quiz.positiveScore) === 0 && (
              <div className="bg-gray-50 p-4 rounded-xl text-center col-span-2">
                <div className="text-2xl font-bold text-red-500">
                  {quiz.totalQuestions * quiz.negativeScore} Negative Points
                </div>
              </div>
            )}
            {score / (quiz.totalQuestions * quiz.positiveScore) > 0 && (
              <div className="bg-gray-50 p-4 rounded-xl text-center col-span-2">
                <div className="text-2xl font-bold text-gray-800">{score} / {quiz.totalQuestions * quiz.positiveScore}</div>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          {score >= passMark ? (
            <div className="bg-green-50 p-6 rounded-xl">
              <Trophy className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-green-700">
                Congratulations! You've passed the quiz!
              </p>
            </div>
          ) : (
            <div className="bg-red-50 p-6 rounded-xl">
              <div className="w-12 h-12 text-red-500 mx-auto mb-4">😔</div>
              <p className="text-xl font-semibold text-red-700">
                Unfortunately, you did not pass. Keep practicing!
              </p>
            </div>
          )}
        </motion.div>

        {/* <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            // onClick={handleSave}
            className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-700 px-6 py-3 rounded-lg hover:bg-green-50 active:bg-green-100 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div> */}
      </motion.div>
    </div>
  );
};

