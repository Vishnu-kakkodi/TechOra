import React, { useEffect, useRef, useState } from 'react';
import { Clock, FileText, Check, Cross, X, Search, Menu, PlayCircle, Filter, FilterIcon } from 'lucide-react';
import Navbar from '../../components/header/Navbar';
import { useQuizListQuery } from '../../store/slices/userSlice';
import { QuizDocument } from '../../types/quizType';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import useDebouncedValue from '../../hooks/debounceHook';
import { useAppSelector } from '../../store/hook';
import { toast } from 'react-toastify';
import Footer from '../../components/footer/Footer';
import enterFullScreen from '../../utils/enterFullScreen';


const QuizList = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
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
  const total = quizData?.total || quizzes.length;
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

    const appElement = document.documentElement;
    enterFullScreen(appElement);

    navigate(`/start-quiz/quizId=${quiz._id}`, {
      state: { quiz: quiz }
    });
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    if (selectedValues.includes("select-all")) {
      handleSelectAll();
    } else {
      setSelectedCategories(selectedValues);
    }
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === quizCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(quizCategories);
    }
  };

  const [isFilterDataOpen, setIsFilterDataOpen] = useState(false);


  const toggleFilterData = () => {
    setIsFilterDataOpen((prev) => !prev);
  };



  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className=" w-full max-w-7xl  px-4 sm:px-6 lg:px-8"
      >
        <div className='sm:flex-wrap sm:justify-between sm:items-baseline  md:gap-8'>
          <div>
            <h1 className="text-2xl md:text-4xl mb-5 font-extrabold text-gradient bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 text-transparent bg-clip-text mt-6 text-center">
              We Found {total} Featured Tournaments for You
            </h1>

          </div>
          <div className='flex justify-between items-baseline gap-4'>
            {/* Search Bar for Mobile */}
            <div className="relative w-full  mt-4">
              <Search className="absolute left-2 top-5 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search tournaments"
                value={search}
                onChange={handleSearchChange}
                className="w-full px-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div className="hidden relative md:inline-block">
              {/* Filter Button */}
              <button
                onClick={toggleFilterData}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                aria-expanded={isFilterOpen}
                aria-haspopup="true"
              >
                Filter
                <svg
                  className="ml-2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.292 7.707a1 1 0 011.414 0L10 11.414l3.293-3.707a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Filter Options Container */}
              <div className={isFilterDataOpen ? "absolute z-10 mt-4 w-96 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none p-5" : "hidden"}>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {quizCategories.map((filter: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => handleCategoryToggle(filter)}
                      className={`
              p-3 text-sm  rounded-lg text-center transition-colors
              ${selectedCategories.includes(filter)
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-400'
                        }
            `}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <select
              className="bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/* Filter Button */}
            <button
              onClick={toggleFilter}
              className="block md:hidden mt-4"
            >
              <FilterIcon />
            </button>


            {isFilterOpen && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end">
                <div className="bg-white w-full rounded-t-lg p-4 shadow-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Filter Categories</h3>
                    <button onClick={toggleFilter} className="text-gray-500 hover:text-gray-800">
                      ✖
                    </button>
                  </div>

                  {/* Filter Dropdown */}
                  <div className="mt-4">
                    <label htmlFor="filter-dropdown" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Categories
                    </label>
                    <select
                      id="filter-dropdown"
                      multiple
                      value={selectedCategories}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none h-32 overflow-auto"
                    >
                      {/* Default "Select All" Option */}
                      <option
                        value="select-all"
                        onClick={handleSelectAll}
                        className="text-gray-700 font-semibold"
                      >
                        Select All
                      </option>
                      {/* Map other options */}
                      {quizCategories.map((option: string) => (
                        <option key={option} value={option} className="text-gray-700">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-between">
                    <button
                      // onClick={handleClearFilter}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      Clear
                    </button>
                    <button
                      // onClick={handleFilterChange}
                      className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className='flex'>
        < motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid w-[400] m-2 md:m-2 lg:m-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6 bg-gray-100">
            {quizzes.map((quiz: QuizDocument) => (
              <div
                key={quiz._id}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-md"
              >
                {/* Mobile Layout */}
                <div className="flex flex-col gap-4 sm:hidden">
                  {/* Row 1: Status, Calendar, Start & End Date */}
                  <div className="flex items-center justify-between">
                    {/* Status */}
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                      {quiz.status}
                    </div>

                    {/* Start & End Date */}
                    <div className="text-xs text-gray-700">
                      <p>
                        <strong>START:</strong> {quiz.startDate}
                      </p>
                      <p>
                        <strong>END:</strong> {quiz.startDate}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Quiz Title */}
                  <div className="text-lg font-bold text-center">{quiz.title}</div>

                  {/* Row 3: Conducted By */}
                  <div className="text-sm text-gray-500 text-center">
                    <p>
                      <strong>Conducted By:</strong> Department of {quiz.department}
                    </p>
                    <p>{quiz.institutionId?.collegeName}</p>
                  </div>

                  {/* Row 4: Start Quiz Button */}
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      <PlayCircle className="mr-2" size={20} />
                      Start Quiz
                    </button>
                  </div>
                </div>

                {/* Larger Screens Layout (Unchanged) */}
                <div className="hidden sm:block m-3">
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

                    <div className="flex flex-col justify-start gap-2">
                      <h2 className="text-lg font-bold">{quiz.title}</h2>
                      <p className="text-sm text-gray-500">
                        <strong>Conducted By:</strong> Department of {quiz.department}
                      </p>
                      <p className="text-sm text-gray-500">{quiz.institutionId?.collegeName}</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 gap-4">

                    <div className="flex flex-col justify-center gap-2 bg-gray-100 border-2 border-red-100 p-1 rounded-[5px]">
                      <p className="text-[10px] text-gray-700">
                        <strong>END DATE:</strong> <span className="font-medium">{quiz.startDate}</span>
                      </p>
                      <p className="text-[10px] text-gray-700">
                        <strong>Duration:</strong> <span className="font-medium">{quiz.duration}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      <PlayCircle className="mr-2" size={20} />
                      Start Quiz
                    </button>
                  </div>
                </div>
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