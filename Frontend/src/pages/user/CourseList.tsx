
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    BookOpen,
    ChevronDown,
    Clock,
    Heart,
    Menu,
    Search,
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
    const [limit, setLimit] = useState(3);
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
                toast.success("Course added to cart successfully!");
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

    return (
        <>
            <Navbar />
            <div className="flex min-h-screen bg-gray-50">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden fixed top-[60px] left-2 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isOpen ? (
                        <X className="h-6 w-6 text-gray-600" />
                    ) : (
                        <Menu className="h-6 w-6 text-gray-600" />
                    )}
                </motion.button>

                <AnimatePresence>
                    {(isOpen || window.innerWidth >= 1024) && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={sidebarVariants}
                            className="fixed lg:relative inset-y-0 left-0 z-40 m-5 w-80  bg-purple-100 shadow-lg"
                        >
                            <div className="h-full overflow-y-auto pt-16 lg:pt-0">
                                <div className="p-6 space-y-8">
                                    <div>
                                        <h2 className="text-xl font-bold mb-4 text-gray-800">Search</h2>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Search courses..."
                                                value={search}
                                                onChange={handleSearchChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold mb-4 text-gray-800">Categories</h2>
                                        <div className="space-y-2">
                                            {courseCategories.map((category:string, index:number) => (
                                                <motion.label
                                                    key={index}
                                                    className="flex items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => handleCategoryToggle(category)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="ml-3 text-gray-700">{category}</span>
                                                </motion.label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 px-4 lg:px-8 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow-md rounded-xl p-6 mb-8"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                            <div className="text-gray-800 text-[25px] font-medium">
                                We Offer <span className="text-blue-600 font-bold">{totalCourse}</span> courses for You
                            </div>
                            <select
                                className="bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="">Default Sort</option>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {courses.map((course:CourseDocument) => (
                            <div
                                key={course.id}
                                className="bg-white border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                {/* Course Image */}
                                <div className="relative">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-44 md:h-52 object-cover"
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
                        ))}
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