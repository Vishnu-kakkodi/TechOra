
import React, { useState, useRef, ChangeEvent } from 'react';
import { Plus, Trash2, GripVertical, AlertCircle, Image as ImageIcon, Clock, RefreshCcw, Upload, X } from 'lucide-react';
import InstituteSidebar from '../../components/sidebar/InstituteSidebar';
import { useAddQuizMutation } from '../../store/slices/institutionSlice';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { QuestionType, QuizStatus, Question, QuizData, QuestionBoxProps, Option } from '../../types/quizType'

const CreateQuiz: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [maxQuestions, setMaxQuestions] = useState<number>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showMaxAlert, setShowMaxAlert] = useState<boolean>(false);
  const [addQuiz] = useAddQuizMutation();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');


  const [quizData, setQuizData] = useState<QuizData>({
    title: '',
    description: '',
    duration: '30',
    maxAttempts: '3',
    thumbnailQuiz: null,
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
      status: 'draft'
    }],
    status: 'draft',
    totalQuestions: 1
  });


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
      status: 'draft'
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
      questions: prev.questions.filter((_, i) => i !== index)
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

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // const removeThumbnail = () => {
  //   setThumbnailFile(null);
  //   setThumbnailPreview(null);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = '';
  //   }
  // };

  const initialValues: QuizData = {
    title: '',
    description: '',
    duration: '30',
    maxAttempts: '3',
    thumbnailQuiz: null,
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
      status: 'draft'
    }],
    status: 'draft',
    totalQuestions: 1
  };
  const handleSubmit = async (
    values: QuizData,
    { setSubmitting }: FormikHelpers<QuizData>
  ): Promise<void> => {
    try {
      const formData = new FormData();

      console.log(quizData)

      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'thumbnail' && value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      formData.append('title', values.title);

      if (values.description) {
        formData.append('description', values.description);
      }

      if (values.duration) {
        formData.append('duration', values.duration.toString());
      }

      if (values.maxAttempts) {
        formData.append('maxAttempts', values.maxAttempts.toString());
      }

      if (values.thumbnailQuiz) {
        formData.append('thumbnailQuiz', values.thumbnailQuiz);
      }


      formData.append('totalQuestions', values.questions.length.toString());

      formData.append('status', values.status);

      const entries = Array.from(formData.entries());
      entries.forEach(([key, value]) => {
        console.log(key, value);
      });
      const response = await addQuiz({
        body: formData
      }).unwrap();

      console.log('Quiz created successfully:', response);

    } catch (error) {
      console.error('Failed to create quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (
    setFieldValue: (field: string, value: any) => void,
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue('thumbnail', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (setFieldValue: (field: string, value: any) => void): void => {
    setFieldValue('thumbnail', null);
    setPreviewUrl('');
  };

  return (
    <div className="flex">
      <InstituteSidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-6">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, errors, touched }) => (
                <Form className="space-y-8">
                  <div className="flex-1">
                    <div className="mb-6">
                      <h1 className="text-2xl font-bold mb-4">Create New Quiz</h1>
                      <div className="mt-4 border-t pt-4">
                        <h3 className="text-lg font-medium mb-2">Quiz Thumbnail</h3>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                          {previewUrl ? (
                            <div className="relative">
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-48 w-96 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(setFieldValue)}
                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-1 text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                  <span>Upload a file</span>
                                  <input
                                    type="file"
                                    name="thumbnailQuiz"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(event) => handleImageChange(setFieldValue, event)}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <Field
                          type="text"
                          name="title"
                          placeholder="Quiz Title"
                          className="text-lg font-semibold px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          // value={quizData.title}
                          // onChange={(e: any) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <select
                          value={quizData.status}
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
                          max="20"
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <Field
                        type="textarea"
                        name="description"
                        placeholder="Quiz Description"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        rows={3}
                      />
                    </div>

                    {quizData.questions[currentQuestionIndex] && (
                      <div className="bg-white rounded-lg shadow my-4">
                        <div className="p-6">
                          <div className="flex items-center gap-4">
                            <GripVertical className="text-gray-400" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">Question {currentQuestionIndex + 1}</h3>
                                <div className="flex items-center gap-4">
                                  <Field
                                    as="select"
                                    name="type"
                                    value={quizData.questions[currentQuestionIndex].type}
                                    onChange={(e: any) => handleQuestionTypeChange(currentQuestionIndex, e.target.value as QuestionType)}
                                    className="px-2 py-1 border rounded-lg"
                                  >
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="true-false">True/False</option>
                                    <option value="short-answer">Short Answer</option>
                                  </Field>
                                  <button
                                    onClick={() => removeQuestion(currentQuestionIndex)}
                                    className="p-2 text-gray-500 hover:text-red-500 rounded-lg"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <Field
                                  type="text"
                                  placeholder="Enter your question"
                                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={quizData.questions[currentQuestionIndex].question}
                                  onChange={(e: any) => updateQuestion(currentQuestionIndex, 'question', e.target.value)}
                                />

                                {quizData.questions[currentQuestionIndex].type === 'multiple-choice' && (
                                  <div className="space-y-2">
                                    {quizData.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                                      <div key={optionIndex} className="flex items-center gap-2">
                                        <Field
                                          type="checkbox"
                                          checked={option.isCorrect}
                                          onChange={(e: any) => updateOption(currentQuestionIndex, optionIndex, 'isCorrect', e.target.checked)}
                                          className="w-4 h-4"
                                        />
                                        <Field
                                          type="text"
                                          placeholder={`Option ${optionIndex + 1}`}
                                          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          value={option.text}
                                          onChange={(e: any) => updateOption(currentQuestionIndex, optionIndex, 'text', e.target.value)}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {quizData.questions[currentQuestionIndex].type === 'true-false' && (
                                  <div className="space-y-2">
                                    {['True', 'False'].map((value, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <Field
                                          type="radio"
                                          name={`correct-${quizData.questions[currentQuestionIndex].id}`}
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
                                          className="w-4 h-4"
                                        />
                                        <span>{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {quizData.questions[currentQuestionIndex].type === 'short-answer' && (
                                  <Field
                                    type="text"
                                    name=""
                                    placeholder="Correct Answer"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={quizData.questions[currentQuestionIndex].options[0]?.text || ''}
                                    onChange={(e: any) => updateOption(currentQuestionIndex, 0, 'text', e.target.value)}
                                  />
                                )}

                                <Field
                                  type="textarea"
                                  name="explanation"
                                  placeholder="Explanation (Optional) - Provide explanation for the correct answer"
                                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={quizData.questions[currentQuestionIndex].explanation || ''}
                                  onChange={(e: any) => updateQuestion(currentQuestionIndex, 'explanation', e.target.value)}
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={addQuestion}
                      className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={quizData.questions.length >= maxQuestions}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </button>

                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {isSubmitting ? 'Creating...' : 'Create Course'}
                        Publish Quiz
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
                      onClick={() => setCurrentQuestionIndex(index)}
                    />
                  ))}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Quiz Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${quizData.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
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
                      <span>{quizData.questions.filter(q => isQuestionComplete(q)).length}</span>
                    </div>
                  </div>
                </div>

                {quizData.status === 'published' && (
                  <div className="mt-4">
                    {quizData.questions.length === 0 && (
                      <div className="text-red-500 text-sm">
                        ⚠️ Published quizzes must have at least one question
                      </div>
                    )}
                    {!quizData.questions.every(isQuestionComplete) && (
                      <div className="text-red-500 text-sm">
                        ⚠️ All questions must be complete before publishing
                      </div>
                    )}
                  </div>
                )}
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
