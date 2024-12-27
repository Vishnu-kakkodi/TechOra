import React, { useEffect, useRef, useState } from 'react';
import { Clock, FileText, Check, Cross, X, Search, Menu, PlayCircle } from 'lucide-react';
import Navbar from '../../components/header/Navbar';
import { useQuizListQuery } from '../../store/slices/userSlice';
import { QuizDocument } from '../../types/quizType';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import useDebouncedValue from '../../hooks/debounceHook';
import { useAppSelector } from '../../store/hook';
import { toast } from 'react-toastify';
import Footer from '../../components/footer/Footer';


const QuizList = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const debouncedSearchTerm = useDebouncedValue(search, 500);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userdata = useAppSelector((state) => state.auth.userInfo);



  const navigate = useNavigate();


  const {
    data: quizData,
    isLoading,
    isError
  } = useQuizListQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    filter,
    sort
  });

  const quizzes = quizData?.quiz || [];
  const total = quizData?.total || quizzes.length;;
  const quizCategories = quizData?.department || [];

  if (isError) {
    return <div className="max-w-4xl mx-auto p-6">Error loading quizzes. Please try again.</div>;
  }

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filter]);

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
  ];


  const handleStartQuiz = (quiz: QuizDocument) => {
    if (!quiz) {
      console.error('Quiz ID is required to start the quiz.');
      return;
    }
    if (quiz.isComplete?.includes(userdata?._id)) {
      toast.warning("This quiz is already attempted");
      return;
    }

    navigate(`/start-quiz/quizId=${quiz._id}`, {
      state: { quiz: quiz }
    }); console.log('Starting quiz:', quiz._id);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPage(1);
    setSearch(value);
  };

  useEffect(() => {
    const filterParams = [
      ...selectedCategories.map(cat => `${cat}`),
    ].join(',');
    console.log(filterParams, "p")

    setFilter(filterParams);
  }, [selectedCategories]);

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };


  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }} className="ml-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-4xl md:text-5xl mb-5 font-extrabold text-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text text-center mt-6">
            We Found 23 Featured Tournaments for You
          </h1>
        </div>
      </motion.div>
      <div className='flex'>
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden fixed top-[60px] left-2 z-50 p-2 bg-white rounded-lg shadow-lg"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
          <div
            className={`fixed lg:relative inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out bg-gray-50 
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          >
            {isOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 lg:hidden -z-10"
                onClick={() => setIsOpen(false)}
              />
            )}

            <div className="h-full overflow-y-auto pt-16 lg:pt-0">
              <div className="p-6">
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4">Search</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={search}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-2">Course Categories</h2>
                  <div className="bg-white border rounded-lg p-4">
                    {quizCategories.map((category: any, index: any) => (
                      <label key={index} className="flex items-center py-2 hover:bg-gray-50 rounded px-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-600">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
              <div className="relative ml-5" ref={dropdownRef}>
                <div className="flex items-center space-x-2">
                  <span className="text-red-700 font-medium text-sm sm:text-base">Sort By:</span>
                  <select
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <option value="">Default</option>
                    <option value="newest">New Courses</option>
                    <option value="oldest">Old Courses</option>
                  </select>
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          onClick={() => {
                            setIsDropdownOpen(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        < motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100">
            {quizzes.map((quiz: QuizDocument) => (
              <div
                key={quiz._id}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-md"
              >
                <div className="flex justify-between gap-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-md text-center">
                      {quiz.status}
                    </div>

                    <div className="text-xs border-2 border-black rounded-md bg-gray-100 p-2 mt-2 text-center">
                      <div className="text-lg font-semibold bg-black text-white p-1 rounded">
                        {new Date(quiz.createdAt).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                      </div>
                      <div className="text-lg font-semibold text-gray-700">
                        {new Date(quiz.createdAt).getDate()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-2 bg-gray-100 border-2 border-red-100 p-1 rounded-[5px]">
                    <p className="text-[10px] text-gray-700">
                      <strong>START DATE:</strong> <span className="font-medium">{quiz.startDate}</span>
                    </p>
                    <p className="text-[10px] text-gray-700">
                      <strong>END DATE:</strong> <span className="font-medium">{quiz.startDate}</span>
                    </p>
                    <p className="text-[10px] text-gray-700">
                      <strong>Duration:</strong> <span className="font-medium">{quiz.duration}</span>
                    </p>
                  </div>

                  <div className="flex flex-col justify-start gap-2">
                    <h2 className="text-lg font-bold">{quiz.title}</h2>
                    <p className="text-sm text-gray-500">
                      <strong>Conducted By:</strong> Department of {quiz.department}
                    </p>
                    <p className="text-sm text-gray-500">{quiz.institutionId?.collegeName}</p>
                  </div>
                </div>
                <motion.div
                  className="flex justify-end mt-4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="
      flex items-center justify-center 
      px-6 py-3 
      bg-indigo-600 
      text-white 
      rounded-lg 
      shadow-md 
      hover:bg-indigo-700 
      focus:outline-none 
      focus:ring-2 
      focus:ring-indigo-500 
      focus:ring-offset-2 
      transition-all 
      duration-300 
      transform 
      hover:scale-105 
      active:scale-95
    "
                  >
                    <PlayCircle className="mr-2" size={20} />
                    Start Quiz
                  </button>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page * limit >= total}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(page - 1) * limit + 1}</span>{' '}
                  to{' '}
                  <span className="font-medium">{Math.min(page * limit, total)}</span>{' '}
                  of{' '}
                  <span className="font-medium">{total}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    {page}
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page * limit >= total}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />

    </>
  );
};

export default QuizList;