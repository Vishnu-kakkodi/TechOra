
import React, { useEffect, useState } from 'react';
import { Clock, Book, AlertCircle, Calendar, RefreshCcw, Award, TrendingUp, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuizDetailQuery } from '../../store/slices/tutorSlice';

interface QuizOption {
    text: string;
    isCorrect: boolean;
}

interface Question {
    question: string;
    points: number;
    status: string;
    options: QuizOption[];
    explanation?: string;
}

interface QuizQuestion {
    question: Question;
}

interface QuizDocument {
    _id: string;
    title: string;
    description: string;
    duration: number;
    totalQuestions: number;
    maxAttempts: number;
    passingScore: number;
    department: string;
    stack: string;
    type: 'multiple-choice' | 'true-false' | 'other';
    difficultyLevel: 'easy' | 'medium' | 'hard';
    status: 'published' | 'draft';
    startDate: string;
    positiveScore: number;
    negativeScore: number;
    questions: QuizQuestion[];
}

interface QuizMetricCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    className: string;
}

interface QuestionCardProps {
    question: Question;
    index: number;
}

const QuizDetail: React.FC = () => {
    const [status, setStatus] = useState<string>('pending');
    const [loading, setLoading] = useState<boolean>(true);
    const { quizId } = useParams<{ quizId: string }>();
    const [currentQuiz, setCurrentQuiz] = useState<QuizDocument | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const navigate = useNavigate();

    const { data: quizData, isLoading, isError } = useQuizDetailQuery(quizId);

    useEffect(()=>{
        setCurrentQuiz(quizData?.data);
        setStatus(quizData?.data.status.toLowerCase());
    },[quizData])

    const handleEdit = () => {
        navigate(`/tutor/edit-quiz/${quizId}`)
    }

    const QuizMetricCard: React.FC<QuizMetricCardProps> = ({ icon: Icon, title, value, className }) => (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
                <div className={`p-2 rounded-lg ${className}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-lg font-semibold">{value}</p>
                </div>
            </div>
        </div>
    );

    const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">Question {index + 1}</h3>
            </div>

            <p className="text-gray-800 mb-4">{question.question}</p>

            <div className="space-y-3 mb-6">
                {question.options?.map((option, i) => (
                    <div key={i} className="flex items-center space-x-3">
                        {option.isCorrect ? (
                            <Check className="w-5 h-5 text-green-500" />
                        ) : (
                            <X className="w-5 h-5 text-gray-300" />
                        )}
                        <span className={`${option.isCorrect ? 'font-medium text-green-700' : 'text-gray-600'}`}>
                            {option.text}
                        </span>
                    </div>
                ))}
            </div>

            {question.explanation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <span className="font-medium">Explanation: </span>
                        {question.explanation}
                    </p>
                </div>
            )}
        </div>
    );

    const QuestionNavigation: React.FC = () => (
        <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
            </button>

            <div className="flex space-x-2">
                {currentQuiz?.questions.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-8 h-8 rounded-full text-sm font-medium ${currentQuestionIndex === index
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(currentQuiz?.questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === currentQuiz?.questions.length - 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
            </button>
        </div>
    );

    const getDifficultyColor = (level?: 'easy' | 'medium' | 'hard'): string => {
        switch (level) {
            case 'easy': return 'text-green-600 bg-green-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'hard': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusColor = (status?: string): string => {
        return status === 'published'
            ? 'text-green-600 bg-green-50'
            : 'text-yellow-600 bg-yellow-50';
    };

    return (
        <div className="flex">
            <div className="flex-1 p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{currentQuiz?.title}</h1>
                                <p className="mt-2 text-gray-600">{currentQuiz?.description}</p>
                            </div>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleEdit}>
                                    Edit Quiz
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                    Preview
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <QuizMetricCard
                                icon={Clock}
                                title="Duration"
                                value={`${currentQuiz?.duration} minutes`}
                                className="bg-blue-50 text-blue-600"
                            />
                            <QuizMetricCard
                                icon={Book}
                                title="Total Questions"
                                value={currentQuiz?.totalQuestions || 0}
                                className="bg-purple-50 text-purple-600"
                            />
                            <QuizMetricCard
                                icon={RefreshCcw}
                                title="Max Attempts"
                                value={currentQuiz?.maxAttempts || 0}
                                className="bg-yellow-50 text-yellow-600"
                            />
                            <QuizMetricCard
                                icon={Award}
                                title="Passing Score"
                                value={`${currentQuiz?.passingScore || 0}`}
                                className="bg-green-50 text-green-600"
                            />
                        </div>

                        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Department</p>
                                    <p className="font-medium">{currentQuiz?.department}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Stack</p>
                                    <p className="font-medium">{currentQuiz?.stack}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Difficulty</p>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(currentQuiz?.difficultyLevel)}`}>
                                        {currentQuiz?.difficultyLevel}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(currentQuiz?.status)}`}>
                                        {currentQuiz?.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Start Date</p>
                                    <p className="font-medium">{currentQuiz?.startDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Correct Answer Score</p>
                                    <p className="font-medium text-green-600">+{currentQuiz?.positiveScore}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Wrong Answer Score</p>
                                    <p className="font-medium text-red-600">-{currentQuiz?.negativeScore}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {currentQuiz && currentQuiz.questions[currentQuestionIndex] && (
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Questions</h2>
                                <span className="text-sm text-gray-500">
                                    Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                                </span>
                            </div>

                            <QuestionCard
                                question={currentQuiz.questions[currentQuestionIndex]}
                                index={currentQuestionIndex}
                            />

                            <QuestionNavigation />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizDetail;