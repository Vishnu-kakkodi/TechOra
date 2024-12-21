import React, { useEffect, useRef, useState } from 'react';
import { Eye, Clock, Book, AlertCircle, ChevronDown, Search } from 'lucide-react';
import InstituteSidebar from '../../components/sidebar/InstituteSidebar';
import { useQuizListQuery } from '../../store/slices/institutionSlice';
import { QuizDocument } from '../../types/quizType';
import { Link } from 'react-router-dom';
import useDebouncedValue from '../../hooks/debounceHook';
import InstituteFooter from '../../components/footer/InstituteFooter';

const ListQuiz = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
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
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);


    const {
        data: quizData,
        isLoading,
        isError
    } = useQuizListQuery({
        page,
        limit,
        search: debouncedSearchTerm,
        filter,
        sort,
        selectedStatus
    });

    const quizzes = quizData?.quiz || [];
    const total = quizData?.total || quizzes.length;;
    const quizCategories = quizData?.department || [];

    useEffect(() => {
        setPage(1);
      }, [debouncedSearchTerm, filter]);

    useEffect(() => {
        const filterParams = [
            ...selectedDepartments.map(cat => `${cat}`),
        ].join(',');

        setFilter(filterParams);
    }, [selectedDepartments]);



    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
      ];

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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPage(1);
        setSearch(value);
    };

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

    const handleSelection = (category: string) => {
        setSelectedDepartments((prev) =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category]
        );
    };

    return (
        <div className="flex">
            <InstituteSidebar />
            <div className='w-full'>
            <div className="flex-1 p-6 bg-gray-50 min-h-screen">
                <h1 className='text-[25px] my-4'>Quiz List</h1>
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Search courses..."
                                            value={search}
                                            onChange={handleSearchChange}
                                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
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
                                <div className="relative">
                                    <select

                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="appearance-none w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">All Status</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between mx-2'>
                            <div>
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
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {quizzes.map((quiz: QuizDocument) => (
                                            <tr key={quiz.id} className="hover:bg-gray-50">
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                            </div>
                            <div className="relative">
                                <div className="border border-gray-300 rounded-lg bg-white p-4">
                                    <strong className="block mb-2 text-gray-700">Departments</strong>
                                    {quizCategories.map((category: string, index: number) => (
                                        <div key={index} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`category-${index}`}
                                                value={category}
                                                checked={selectedDepartments.includes(category)}
                                                onChange={() => handleSelection(category)}
                                                className="mr-2 focus:ring-blue-500"
                                            />
                                            <label htmlFor={`category-${index}`} className="text-gray-800">
                                                {category}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default ListQuiz;