
import React, { ReactNode, useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical, AlertCircle, Clock, RefreshCcw } from 'lucide-react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { QuestionType, QuizStatus, Question, QuizData, QuestionBoxProps, Option, QuizDatas } from '../../types/quizType'
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import { useAddQuizMutation } from '../../store/slices/tutorSlice';
import { useAppSelector } from '../../store/hook';

const QuizValidationSchema = Yup.object().shape({
  title: Yup.string().required('Quiz title is required'),
  duration: Yup.number().positive('Duration must be positive').required('Duration is required'),
  maxAttempts: Yup.number().positive('Max attempts must be positive').required('Max attempts is required'),
  department: Yup.string().required('Department selection is required'),
  stack: Yup.string().required('Stack is required'),
  difficultyLevel: Yup.string().required('Difficulty level is required'),
  positiveScore: Yup.number().min(1, 'Minimum score is 1').max(4, 'Maximum score is 4').required('Positive score is required'),
  negativeScore: Yup.number().min(0, 'Minimum negative score is 0').max(1, 'Maximum negative score is 1').required('Negative score is required'),
  passingScore: Yup.number().positive('Passing score must be positive').required('Passing score is required'),
  description: Yup.string().required('Quiz description is required'),
  startDate: Yup.date().required('Start date is required')
});

interface ErrorMessageProps {
  name: string;
}

interface InputWrapperProps {
  children: ReactNode;
  name: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ name }) => {
  return (
    <div className="text-red-500 text-sm mt-1 pl-4">
      <Field name={name}>
        {({ form }: FieldProps) => {
          const { touched, errors } = form;
          return touched[name] && errors[name] ? (
            <span className="block">{errors[name] as string}</span>
          ) : null;
        }}
      </Field>
    </div>
  );
};

const InputWrapper: React.FC<InputWrapperProps> = ({ children, name }) => {
  return (
    <div className="relative">
      {children}
      <ErrorMessage name={name} />
    </div>
  );
};


const CreateQuiz: React.FC = () => {
  const [maxQuestions, setMaxQuestions] = useState<number>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showMaxAlert, setShowMaxAlert] = useState<boolean>(false);
  const [addQuiz] = useAddQuizMutation();
  const [questionModal, setQuestionModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const tutordata = useAppSelector((state) => state.auth.tutorInfo);


  const initialQuizData: QuizDatas = {
    title: '',
    description: '',
    duration: '30',
    maxAttempts: '3',
    questions: [{
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
    status: 'published',
    totalQuestions: 1,
    department: '',
    stack: '',
    difficultyLevel: '',
    positiveScore: 1,
    negativeScore: 1,
    passingScore: 1,
    startDate: ''
  };

  const [quizData, setQuizData] = useState<QuizDatas>(initialQuizData);

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

  // const handleSubmit = async (values: QuizData): Promise<void> => {
  //   try {
  //     const quizPayload = {
  //       ...values,
  //       questions: quizData.questions,
  //       totalQuestions: quizData.questions.length,
  //       positiveScore: Number(values.positiveScore),
  //       negativeScore: Number(values.negativeScore),
  //       passingScore: Number(values.passingScore)
  //     };
  //     const response = await addQuiz(quizPayload).unwrap();
  //     console.log("OKKKKK")
  //     if (response) {
  //       console.log("Quiz Created successfully",response.data)
  //       sendNotification({
  //         type: 'QUIZ_CREATED',
  //         data: {
  //           quizId: response.data,
  //           title: values.title,
  //           department: values.department,
  //           createdBy: tutordata?.id,
  //           creatorName: tutordata?.name
  //         },
  //         recipients: ['admin', 'students'],
  //         message: `New quiz "${values.title}" has been created for ${values.department} department`
  //       });
  //       toast.success(response.message);
  //       navigate('/tutor/quizzes');
  //     }
  //   } catch (error) {
  //     console.error('Failed to create quiz:', error);
  //   }
  // };

  const handleSubmit = async (values: QuizDatas): Promise<void> => {
    try {
      const quizPayload = {
        ...values,
        questions: quizData.questions,
        totalQuestions: quizData.questions.length,
        positiveScore: Number(values.positiveScore),
        negativeScore: Number(values.negativeScore),
        passingScore: Number(values.passingScore)
      };

      const response = await addQuiz(quizPayload).unwrap();

      // if (response?.data) {
      //   try {
      //     await sendNotification({
      //       quizId: response.data,
      //       title: values.title,
      //       department: values.department,
      //       createdBy: tutordata?.id,
      //       creatorName: tutordata?.name
      //     });
      //     toast.success('Quiz created and notification sent');
      //   } catch (error) {
      //     console.error('Failed to send notification:', error);
      //     toast.warning('Quiz created but notification failed');
      //   }
      // }
    } catch (error) {
      console.error('Failed to create quiz:', error);
      toast.error('Failed to create quiz');
    }
  };

  return (
    <div className="flex">
      <TutorSidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-6">
            <Formik
              initialValues={initialQuizData}
              validationSchema={QuizValidationSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form className="space-y-8 flex-1">
                  <div className="flex-1">
                    <div className="mb-6">
                      <h1 className="text-2xl font-bold mb-4">Create New Quiz</h1>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <InputWrapper name="title">
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Quiz Title
                          </label>
                          <Field
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter quiz title"
                            className="text-lg font-semibold px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </InputWrapper>

                        <InputWrapper name="status">
                          <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Quiz Status
                          </label>
                          <select
                            id="status"
                            value={quizData.status}
                            onChange={(e) => setQuizData(prev => ({ ...prev, status: e.target.value as QuizStatus }))}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        </InputWrapper>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <InputWrapper name="duration">
                          <label
                            htmlFor="duration"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Quiz Duration (minutes)
                          </label>
                          <Field
                            type="number"
                            id="duration"
                            name="duration"
                            placeholder="Duration (minutes)"
                            min="1"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </InputWrapper>

                        <InputWrapper name="maxAttempts">
                          <label
                            htmlFor="maxAttempts"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Max No. of Attempts
                          </label>
                          <Field
                            type="number"
                            id="maxAttempts"
                            name="maxAttempts"
                            placeholder="Max Attempts"
                            min="1"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </InputWrapper>

                        <InputWrapper name="maxQuestions">
                          <label
                            htmlFor="maxQuestions"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Max No. of Questions
                          </label>
                          <Field
                            type="number"
                            id="maxQuestions"
                            placeholder="Max Questions"
                            name="maxQuestions"
                            min="1"
                            max="20"
                            value={maxQuestions}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxQuestions(parseInt(e.target.value))}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </InputWrapper>

                        <InputWrapper name="department">
                          <label
                            htmlFor="department"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Academic Department
                          </label>
                          <Field
                            as="select"
                            id="department"
                            name="department"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Department</option>
                            <option value="computer-science">Computer Science</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="business">Business</option>
                            <option value="hotel-management">Hotel Management</option>
                          </Field>
                        </InputWrapper>

                        <InputWrapper name="stack">
                          <label
                            htmlFor="stack"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Technology Stack
                          </label>
                          <Field
                            type="text"
                            id="stack"
                            name="stack"
                            placeholder="Enter technology stack"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </InputWrapper>

                        <InputWrapper name="difficultyLevel">
                          <label
                            htmlFor="difficultyLevel"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Difficulty Level
                          </label>
                          <Field
                            as="select"
                            id="difficultyLevel"
                            name="difficultyLevel"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Difficulty Level</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </Field>
                        </InputWrapper>

                        <InputWrapper name="positiveScore">
                          <label
                            htmlFor="positiveScore"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Points for Correct Answer
                          </label>
                          <Field
                            type="number"
                            id="positiveScore"
                            name="positiveScore"
                            placeholder="Score for correct"
                            min="1"
                            max="4"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </InputWrapper>

                        <InputWrapper name="negativeScore">
                          <label
                            htmlFor="negativeScore"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Penalty for Wrong Answer
                          </label>
                          <Field
                            type="number"
                            id="negativeScore"
                            name="negativeScore"
                            placeholder="Score for wrong"
                            min="0"
                            max="1"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </InputWrapper>

                        <InputWrapper name="passingScore">
                          <label
                            htmlFor="passingScore"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Minimum Passing Score
                          </label>
                          <Field
                            type="number"
                            id="passingScore"
                            name="passingScore"
                            placeholder="Passing Score"
                            min="1"
                            max="100"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </InputWrapper>
                      </div>

                      <InputWrapper name="description">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Quiz Description
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          placeholder="Provide a detailed description of the quiz"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                          rows={3}
                        />
                      </InputWrapper>

                      <div className="mb-4">
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Quiz Start Date
                        </label>
                        <InputWrapper name="startDate">
                          <Field
                            type="date"
                            id="startDate"
                            name="startDate"
                            className="w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </InputWrapper>
                      </div>

                      <div className="flex justify-between items-center gap-4">
                        <h3 className="text-lg font-medium">Question Type</h3>
                        <label htmlFor="questionType" className="sr-only">Select Question Type</label>
                        <Field
                          as="select"
                          id="questionType"
                          name="type"
                          value={quizData.questions[currentQuestionIndex].type}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleQuestionTypeChange(currentQuestionIndex, e.target.value as QuestionType)
                          }
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
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
                              name="question"
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={quizData.questions[currentQuestionIndex].question}
                              onChange={(e) => updateQuestion(currentQuestionIndex, 'question', e.target.value)}
                              rows={3}
                            />

                            {quizData.questions[currentQuestionIndex].type === 'multiple-choice' && (
                              <div className="space-y-2">
                                {quizData.questions[currentQuestionIndex].options.map((option, optionIndex) => (
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

                            {quizData.questions[currentQuestionIndex].type === 'true-false' && (
                              <div className="space-y-2">
                                {['True', 'False'].map((value, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`correct-${currentQuestionIndex}`}
                                      checked={quizData.questions[currentQuestionIndex].options[index]?.isCorrect}
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

                            {quizData.questions[currentQuestionIndex].type === 'short-answer' && (
                              <input
                                type="text"
                                placeholder="Correct Answer"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={quizData.questions[currentQuestionIndex].options[0]?.text || ''}
                                onChange={(e) =>
                                  updateOption(currentQuestionIndex, 0, 'text', e.target.value)
                                }
                              />
                            )}

                            <textarea
                              placeholder="Explanation (Optional) - Provide explanation for the correct answer"
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={quizData.questions[currentQuestionIndex].explanation}
                              onChange={(e) =>
                                updateQuestion(currentQuestionIndex, 'explanation', e.target.value)
                              }
                              rows={3}
                            />
                            {/* {touched.questions?.[currentQuestionIndex]?.question &&
                              errors.questions?.[currentQuestionIndex]?.question && (
                                <div className="text-red-500 text-sm mt-1">
                                  {errors.questions[currentQuestionIndex].question}
                                </div>
                              )} */}

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
                                  disabled={quizData.questions.length >= maxQuestions}
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
                        {isSubmitting ? 'Creating...' : 'Create Quiz'}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="w-64">
              <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Questions ({quizData.questions.length}/{maxQuestions})</h2>
                <div className="grid grid-cols-3 gap-2">
                  {quizData.questions.map((question, index) => (
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
                      <span className={`font-medium ${quizData.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {quizData.status.charAt(0).toUpperCase() + quizData.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{quizData.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Attempts:</span>
                      <span>{quizData.maxAttempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Questions:</span>
                      <span>{quizData.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span>{quizData.questions.filter(isQuestionComplete).length}</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
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
  }
};

export default CreateQuiz;