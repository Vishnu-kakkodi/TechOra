
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    BookOpen,
    ChevronDown,
    Clock,
    Filter,
    FilterIcon,
    Heart,
    Menu,
    Search,
    SortDesc,
    University,
    User,
    X
} from 'lucide-react';
import { useCourseListQuery } from '../../store/slices/userSlice';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/header/Navbar';
import ReactStars from 'react-stars';
import { useAddToCartMutation } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import { ApiError } from '../../types/ApiError';
import useDebouncedValue from '../../hooks/debounceHook';
import { CourseDocument } from '../../types/courseType';
import { motion, AnimatePresence } from 'framer-motion';

const CourseList = () => {
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [currentValue, setCurrentValue] = useState<number | undefined>(3);
    const [addTocart] = useAddToCartMutation();
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');
    const debouncedSearchTerm = useDebouncedValue(search, 500);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { data: courseData, isLoading, error } = useCourseListQuery({
        page, limit, search: debouncedSearchTerm, filter, sort
    });

    const courses = courseData?.course || [];
    const total = courseData?.total || 0;
    const courseCategories = courseData?.department || [];
    const totalCourse = courseData?.totalCourse || 0;
    const Colleges = courses.map((c: CourseDocument) => c?.institutionId?.collegeName);
    const popularColleges = Array.from(new Set(Colleges));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const courseCardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4
            }
        }
    };

    const sidebarVariants = {
        hidden: { x: "-100%" },
        visible: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm, filter]);

    useEffect(() => {
        const filterParams = [...selectedCategories.map(cat => `${cat}`)].join(',');
        setFilter(filterParams);
    }, [selectedCategories]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(1);
        setSearch(event.target.value);
    };

    const handleAddToCart = async (courseId: string) => {
        try {
            const response = await addTocart({ courseId }).unwrap();
            if (response) {
                toast.success(response.message);
            }
        } catch (error: unknown) {
            const ApiError = error as ApiError;
            toast.error(ApiError.data.message);
        }
    };

    const handleNextPage = () => {
        if (page * limit < total) setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
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
    const [isFilterDataOpen, setIsFilterDataOpen] = useState(false);


    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const toggleFilterData = () => {
        setIsFilterDataOpen((prev) => !prev);
    };


    const handleSelectAll = () => {
        if (selectedCategories.length === courseCategories.length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(courseCategories);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex min-h-screen bg-gray-50">
                <div className="flex-1 px-4 lg:px-8 py-6 ">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className=" w-full max-w-7xl  px-4 sm:px-6 lg:px-8"
                    >
                        <div className='sm:flex-wrap sm:justify-between sm:items-baseline  md:gap-8'>
                            <div>
                                <h1 className="text-2xl md:text-4xl mb-5 font-extrabold text-gradient bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 text-transparent bg-clip-text mt-6 text-center">
                                    We Found {total} Featured Courses for You
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
                                            {courseCategories.map((filter: any, index: any) => (
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
                                                    {courseCategories.map((option: string) => (
                                                        <option key={option} value={option} className="text-gray-700">
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="grid mx-1 my-5 md:m-2 lg:m-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 bg-gray-100">
                            {courses.length > 0 ? (
                                courses.map((course: CourseDocument) => (
                                    <div
                                        key={course.id}
                                        className="bg-white border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                                    >
                                        {/* Course Image */}
                                        <div className="relative">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-44 md:h-52 object-fill"
                                            />
                                        </div>

                                        {/* Course Content */}
                                        <div className="p-4 md:p-6">
                                            {/* Title and Tutor */}
                                            <div className="mb-3">
                                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
                                                    {course.title}
                                                </h3>
                                                <div className="flex items-center text-gray-600 text-xs md:text-sm">
                                                    <User size={14} className="mr-2 text-gray-500" />
                                                    <span>{course?.tutorId?.tutorname}</span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-3">
                                                {course.description}
                                            </p>

                                            {/* Rating Section */}
                                            <div className="flex items-center space-x-2 mb-3 md:mb-4">
                                                <ReactStars
                                                    count={5}
                                                    value={course.averageRating}
                                                    size={18}
                                                    edit={false}
                                                    color1={"#d1d5db"}
                                                    color2={"#facc15"}
                                                />
                                                <span className="text-yellow-700 font-semibold text-sm">
                                                    {course.averageRating} ({course.totalReviews} reviews)
                                                </span>
                                            </div>

                                            {/* Course Details */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs md:text-sm text-gray-700 mb-3">
                                                <div className="flex items-center">
                                                    <Clock size={14} className="mr-1 text-blue-500" />
                                                    <span>{course.duration} Weeks</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <User size={14} className="mr-1 text-purple-500" />
                                                    <span>{course.enrolledStudents} Enrolled</span>
                                                </div>
                                            </div>

                                            {/* Price and Enroll Button */}
                                            <div className="flex justify-between items-center">
                                                <div className="text-base md:text-lg font-bold text-blue-700">
                                                    ₹{course?.price?.toFixed(2)}
                                                </div>
                                                <button onClick={() => handleAddToCart(course._id)} className="bg-blue-600 text-white px-4 py-2 text-sm md:text-base rounded-full hover:bg-blue-700 transition-colors">
                                                    Add To Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 col-span-full">
                                    <p className="text-xl md:text-2xl font-semibold text-gray-700">
                                        No courses available at the moment.
                                    </p>
                                    <p className="text-sm md:text-base text-gray-500 mt-2">
                                        Please check back later or explore other categories.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 flex justify-center"
                    >
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePreviousPage}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 disabled:opacity-50"
                            >
                                Previous
                            </motion.button>
                            <span className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-700">
                                {page}
                            </span>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextPage}
                                disabled={page * limit >= total}
                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 disabled:opacity-50"
                            >
                                Next
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CourseList;