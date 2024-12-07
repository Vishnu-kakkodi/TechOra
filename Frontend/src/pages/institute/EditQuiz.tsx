import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, AlertCircle, Clock, RefreshCcw } from 'lucide-react';
import InstituteSidebar from '../../components/sidebar/InstituteSidebar';
import { Formik, Form, Field } from 'formik';
import { QuestionType, QuizStatus, Question, QuizData, QuestionBoxProps, Option, QuizDocument } from '../../types/quizType'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useQuizListQuery } from '../../store/slices/userSlice';
import { useQuizDetailQuery, useUpdateQuizMutation } from '../../store/slices/institutionSlice';

const EditQuiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  // const { data: existingQuiz, isLoading } = useQuizListQuery(quizId);
  const [status, setStatus] = useState<string>('pending');
  const [loading, setLoading] = useState<boolean>(true);
  const [maxQuestions, setMaxQuestions] = useState<number>(20);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showMaxAlert, setShowMaxAlert] = useState<boolean>(false);
  const [questionModal, setQuestionModal] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<QuizData>(null);
  const [updateQuiz] = useUpdateQuizMutation();


  const { data: quizDatas, isLoading, isError } = useQuizDetailQuery(quizId);


  let existingQuiz:QuizDocument= quizDatas?.data
    console.log(existingQuiz,"mm")



  useEffect(()=>{
    setQuizData(existingQuiz);
    setStatus(existingQuiz?.status.toLowerCase());
},[quizDatas])

  useEffect(() => {
    if (existingQuiz) {
      setQuizData({
        ...existingQuiz,
        questions: existingQuiz?.questions.length > 0 
          ? existingQuiz?.questions 
          : [{
              id: 1,
              question: '',
              options: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
              ],
              explanation: '',
              type: 'multiple-choice',
            }],
        totalQuestions: existingQuiz?.questions.length
      });
      setMaxQuestions(existingQuiz?.questions.length || 25);
    }
  }, [existingQuiz]);

  const addQuestion = (): void => {
    if (quizData.questions.length >= maxQuestions) {
      setShowMaxAlert(true);
      setTimeout(() => setShowMaxAlert(false), 3000);
      return;
    }

    const newQuestion: Question = {
      id: quizData.questions.length + 1,
      question: '',
      options: quizData.questions[0].type === 'multiple-choice'
        ? Array(4).fill({ text: '', isCorrect: false })
        : [],
      explanation: '',
      type: quizData.questions[0].type,
    };

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      totalQuestions: prev.totalQuestions + 1
    }));
    setCurrentQuestionIndex(quizData.questions.length);
  };

  const removeQuestion = (index: number): void => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
      totalQuestions: prev.totalQuestions - 1
    }));
    if (currentQuestionIndex >= index && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | number): void => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === index) {
          return { ...q, [field]: value };
        }
        return q;
      })
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof Option, value: string | boolean): void => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === questionIndex) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = {
            ...newOptions[optionIndex],
            [field]: value
          };
          return { ...q, options: newOptions };
        }
        return q;
      })
    }));
  };

  const handleQuestionTypeChange = (questionIndex: number, newType: QuestionType) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === questionIndex) {
          return {
            ...q,
            type: newType,
            options: newType === 'multiple-choice'
              ? Array(4).fill({ text: '', isCorrect: false })
              : newType === 'true-false'
                ? [
                  { text: 'True', isCorrect: false },
                  { text: 'False', isCorrect: false }
                ]
                : []
          };
        }
        return q;
      })
    }));
  };

  const QuestionBox: React.FC<QuestionBoxProps> = ({ index, isActive, isComplete, onClick }) => (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all
        ${isActive ? 'bg-blue-500 text-white' :
          isComplete ? 'bg-green-100 text-green-700 border-2 border-green-500' :
            'bg-gray-100 text-gray-600 border-2 border-gray-300'}
        hover:opacity-80`}
    >
      Q{index + 1}
    </button>
  );

  const handleSubmit = async (values: QuizData): Promise<void> => {
    try {
      const quizPayload = {
        ...values,
        questions: quizData.questions,
        totalQuestions: quizData.questions.length,
        positiveScore: Number(values.positiveScore),
        negativeScore: Number(values.negativeScore),
        passingScore: Number(values.passingScore)
      };
      
      const response = await updateQuiz({quizPayload,quizId}).unwrap();
      if(response){
        toast.success(response.message);
      }
    } catch (error) {
      console.error('Failed to update quiz:', error);
      toast.error('Failed to update quiz');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <InstituteSidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-6">
            <Formik
              initialValues={quizData}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-8 flex-1">
                  <div className="flex-1">
                    <div className="mb-6">
                      <h1 className="text-2xl font-bold mb-4">Edit Quiz</h1>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <Field
                          type="text"
                          name="title"
                          placeholder="Quiz Title"
                          className="text-lg font-semibold px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={quizData?.status}
                          onChange={(e) => setQuizData(prev => ({ ...prev, status: e.target.value as QuizStatus }))}
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <Field
                            type="number"
                            name="duration"
                            placeholder="Duration (minutes)"
                            min="1"
                            className="w-full focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
                          <RefreshCcw className="h-5 w-5 text-gray-400" />
                          <Field
                            type="number"
                            name="maxAttempts"
                            placeholder="Max Attempts"
                            min="1"
                            className="w-full focus:outline-none"
                          />
                        </div>
                        <Field
                          type="number"
                          placeholder="Max Questions"
                          min="1"
                          max="25"
                          value={maxQuestions}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxQuestions(parseInt(e.target.value))}
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Field
                          as="select"
                          name="department"
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Department</option>
                          <option value="computer-science">Computer Science</option>
                          <option value="mathematics">Mathematics</option>
                          <option value="business">Business</option>
                          <option value="hotel-management">Hotel Management</option>
                        </Field>
                        <Field
                          type="text"
                          name="stack"
                          placeholder="Stack"
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Field
                          as="select"
                          name="difficultyLevel"
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Difficulty Level</option>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </Field>
                        <Field
                          type="number"
                          name="positiveScore"
                          placeholder="Score for correct"
                          min="1"
                          max="4"
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Field
                          type="number"
                          name="negativeScore"
                          placeholder="Score for wrong"
                          min="0"
                          max="1"
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Field
                          type="number"
                          name="passingScore"
                          placeholder="Passing Score"
                          min="1"
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <Field
                        as="textarea"
                        name="description"
                        placeholder="Quiz Description"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        rows={3}
                      />

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <Field
                          type="date"
                          name="startDate"
                          className="w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex justify-between items-center gap-4">
                        <h3 className="text-lg font-medium">Question Type</h3>
                        <Field
                          as="select"
                          name="type"
                          value={quizData?.questions[currentQuestionIndex].type}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleQuestionTypeChange(currentQuestionIndex, e.target.value as QuestionType)
                          }
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="short-answer">Short Answer</option>
                        </Field>
                        <button
                          type="button"
                          onClick={() => setQuestionModal(true)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Continue to Questions
                        </button>
                      </div>
                    </div>

                    {questionModal && quizData.questions[currentQuestionIndex] && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Question {currentQuestionIndex + 1}</h3>
                            <button
                              type="button"
                              onClick={() => setQuestionModal(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>

                          <div className="space-y-4">
                            <textarea
                              placeholder="Enter your question"
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={quizData?.questions[currentQuestionIndex].question}
                              onChange={(e) => updateQuestion(currentQuestionIndex, 'question', e.target.value)}
                              rows={3}
                            />

                            {/* Multiple Choice Options */}
                            {quizData?.questions[currentQuestionIndex].type === 'multiple-choice' && (
                              <div className="space-y-2">
                                {quizData?.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={option.isCorrect}
                                      onChange={(e) => 
                                        updateOption(currentQuestionIndex, optionIndex, 'isCorrect', e.target.checked)
                                      }
                                      className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <input
                                      type="text"
                                      placeholder={`Option ${optionIndex + 1}`}
                                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      value={option.text}
                                      onChange={(e) =>
                                        updateOption(currentQuestionIndex, optionIndex, 'text', e.target.value)
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* True/False Options */}
                            {quizData?.questions[currentQuestionIndex].type === 'true-false' && (
                              <div className="space-y-2">
                                {['True', 'False'].map((value, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`correct-${currentQuestionIndex}`}
                                      checked={quizData?.questions[currentQuestionIndex].options[index]?.isCorrect}
                                      onChange={() => {
                                        const newOptions = [
                                          { text: 'True', isCorrect: index === 0 },
                                          { text: 'False', isCorrect: index === 1 }
                                        ];
                                        setQuizData(prev => ({
                                          ...prev,
                                          questions: prev.questions.map((q, i) =>
                                            i === currentQuestionIndex
                                              ? { ...q, options: newOptions }
                                              : q
                                          )
                                        }));
                                      }}
                                      className="w-4 h-4 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{value}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Short Answer Input */}
                            {quizData?.questions[currentQuestionIndex].type === 'short-answer' && (
                              <input
                                type="text"
                                placeholder="Correct Answer"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={quizData?.questions[currentQuestionIndex].options[0]?.text || ''}
                                onChange={(e) =>
                                  updateOption(currentQuestionIndex, 0, 'text', e.target.value)
                                }
                              />
                            )}

                            <textarea
                              placeholder="Explanation (Optional) - Provide explanation for the correct answer"
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={quizData?.questions[currentQuestionIndex].explanation}
                              onChange={(e) =>
                                updateQuestion(currentQuestionIndex, 'explanation', e.target.value)
                              }
                              rows={3}
                            />

                            {showMaxAlert && (
                              <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative">
                                <span className="block sm:inline">
                                  Maximum questions limit reached. Cannot add more questions.
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between gap-4 mt-6">
                              <button
                                type="button"
                                onClick={() => removeQuestion(currentQuestionIndex)}
                                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                                disabled={quizData.questions.length <= 1}
                              >
                                Delete Question
                              </button>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setQuestionModal(false)}
                                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                  Close
                                </button>
                                <button
                                  type="button"
                                  onClick={addQuestion}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                                  disabled={quizData?.questions.length >= maxQuestions}
                                >
                                  Add Another Question
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        onClick={() => window.history.back()}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300"
                      >
                        {isSubmitting ? 'Creating...' : 'Update Quiz'}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="w-64">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Questions ({quizData?.questions.length}/{maxQuestions})</h2>
                <div className="grid grid-cols-3 gap-2">
                  {quizData?.questions.map((question, index) => (
                    <QuestionBox
                      key={question.id}
                      index={index}
                      isActive={currentQuestionIndex === index}
                      isComplete={isQuestionComplete(question)}
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setQuestionModal(true);
                      }}
                    />
                  ))}
                </div>

                {/* <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Quiz Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${quizData?.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {quizData?.status.charAt(0).toUpperCase() + quizData?.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{quizData?.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Attempts:</span>
                      <span>{quizData?.maxAttempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Questions:</span>
                      <span>{quizData?.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span>{quizData?.questions.filter(isQuestionComplete).length}</span>
                    </div>
                  </div>
                </div> */}
              </div>            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const isQuestionComplete = (question: Question): boolean => {
    if (!question.question) return false;

    switch (question.type) {
      case 'multiple-choice':
        return question.options.length === 4 &&
          question.options.every(opt => opt.text.trim() !== '') &&
          question.options.some(opt => opt.isCorrect);
  
      case 'true-false':
        return question.options.some(opt => opt.isCorrect);
  
      case 'short-answer':
        return question.options.length > 0 &&
          question.options[0].text.trim() !== '';
  
      default:
        return false;
    }};

export default EditQuiz;