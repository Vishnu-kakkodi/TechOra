import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ChevronDown,
    Heart,
    Menu,
    Search,
    X
} from 'lucide-react';
import { useCourseListQuery } from '../../store/slices/userSlice';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/header/Navbar';
import ReactStars from 'react-stars';
import { useAddToCartMutation } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import UserCoursePage from '../../components/sidebar/CourseSidebar';
import Topbar from '../../components/TopBar/Topbar';
import { ApiError } from '../../types/ApiError';
import useDebouncedValue from '../../hooks/debounceHook';
import { CourseDocument } from '../../types/courseType';


const CourseList = () => {
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [currentValue, setCurrentValue] = useState<number | undefined>(3);
    const [addTocart] = useAddToCartMutation();
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');
    const debouncedSearchTerm = useDebouncedValue(search, 500);




    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDrop = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
    ];


    const {
        data: courseData,
        isLoading,
        error
    } = useCourseListQuery({
        page,
        limit,
        search: debouncedSearchTerm,
        filter,
        sort
    });

    const courses = courseData?.course || [];
    const total = courseData?.total || 0;
    const courseCategories = courseData?.department || [];
    const totalCourse = courseData?.totalCourse || 0;

    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm, filter]);


    // const course = courses?.data || [];
    console.log(courses, "co")


    // const Categories = courses.map((c: any) => c.department);

    // const courseCategories = Array.from(new Set(Categories));

    const Colleges = courses.map((c: any) => c.institutionId.collegeName);


    const popularColleges = Array.from(new Set(Colleges));


    useEffect(() => {
        const filterParams = [
            ...selectedCategories.map(cat => `${cat}`),
            // ...selectedColleges.map(col => `college=${col}`)
        ].join(',');
        console.log(filterParams, "p")

        setFilter(filterParams);
    }, [selectedCategories]);

    console.log(typeof (filter))

    {
        courseCategories.map((category, index) => (
            <label key={index} className="flex items-center py-2 hover:bg-gray-50 rounded px-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-600">{category}</span>
            </label>
        ))
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPage(1);
        setSearch(value);
    };


    const handleEdit = (courseId: number) => {
        navigate(`/courses/edit/${courseId}`);
    };

    // const handleView = (courseId: string) => {
    //   if (course) {
    //     console.log("User list fetched successfully:", course);
    //     navigate('/institute/courses-view', {state:{courseId:courseId}});
    //   } else {
    //     console.error("Error fetching course list:");
    //   }
    // };

    const handleDelete = (courseId: number) => {
        console.log('Delete course:', courseId);
    };

    const toggleDropdown = (courseId: number) => {
        setActiveDropdown(activeDropdown === courseId ? null : courseId);
    };

    const handleAddToCart = async (courseId: string) => {
        try {
            console.log(courseId, "CourseIdldjflkj")
            const response = await addTocart({ courseId }).unwrap()
            if (response) {
                // toast.success(response.message)

            }
        } catch (error: unknown) {
            console.log(error, "Error")
            const ApiError = error as ApiError
            toast.error(ApiError.data.message)
        }
    }

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

    const handleCollegeToggle = (college: string) => {
        setSelectedColleges(prev =>
            prev.includes(college)
                ? prev.filter(col => col !== college)
                : [...prev, college]
        );
    };

    return (
        <>
            <Navbar />
            <div className='flex'>
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
                                    {courseCategories.map((category, index) => (
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

                            {/* <div className="mb-8">
                                <h2 className="text-lg font-bold mb-2">Popular Colleges</h2>
                                <div className="bg-white border rounded-lg p-4">
                                    {popularColleges.map((college, index) => (
                                        <label key={index} className="flex items-center py-2 hover:bg-gray-50 rounded px-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedColleges.includes(college)}
                                                onChange={() => handleCollegeToggle(college)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-3 text-sm text-gray-600">{college}</span>
                                        </label>
                                    ))}
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="ml-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 my-4 sm:my-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <div className="text-gray-600 font-medium text-sm sm:text-base">
                                    We found <span className="text-red-800 font-bold">{totalCourse}</span> courses for you.
                                </div>

                                <div className="relative" ref={dropdownRef}>
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
                    <div className='flex ml-10'>
                        <div className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold">Course List</h1>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-6">
                                {/* <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div> */}

                                {/* <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="appearance-none w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Departments</option>
            <option value="cs">Computer Science</option>
            <option value="math">Mathematics</option>
            <option value="business">Business</option>
          </select>
          <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
        </div> */}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[60px]">
                                {courses.map((course: CourseDocument) => (
                                    <div
                                        key={course.id}
                                        className="bg-white  shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="relative w-[400px] h-48 overflow-hidden">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">{course.title}</h3>
                                                    <p className="text-gray-500 text-sm">{course.department}</p>
                                                </div>
                                                <div>
                                                    <Heart className="text-red-500" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Instructor</span>
                                                    <span className="font-medium">{course.instructor}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Duration</span>
                                                    <span className="font-medium">{course.duration} Weeks</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Enrolled</span>
                                                    {/* <span className="font-medium">{course.enrolled} Students</span> */}
                                                </div>
                                                {/* <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.status}
                  </span>
                </div> */}
                                                <div className="flex justify-between text-sm items-center">
                                                    <span className="text-gray-500">
                                                        <div className="d-flex align-items-center">
                                                            <ReactStars
                                                                count={5}
                                                                value={currentValue}
                                                                onChange={(newValue: number | undefined) => setCurrentValue(newValue)}
                                                                size={24}
                                                                color2={'#ffd700'}
                                                            />
                                                            <span>(26)</span>
                                                            {/* <CButton
                                                        className="ms-3"
                                                        color="primary"
                                                        onClick={() => setCurrentValue(0)}
                                                    >
                                                        Reset
                                                    </CButton> */}
                                                        </div>
                                                    </span>
                                                    <Link to={`/course-view/${course._id}`}>
                                                        <span className="px-2 py-1 rounded-full text-xs">
                                                            <span className="underline font-bold text-[13px] decoration-gray-200 decoration-2">Learn More</span>+
                                                        </span>
                                                    </Link>

                                                </div>
                                                <div onClick={() => handleAddToCart(course._id)} className="bg-gray-500 text-white py-2 px-4 rounded-lg font-bold flex justify-center hover:bg-gray-600 cursor-pointer">
                                                    Add To Cart
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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


            </div>

            <Footer />
        </>

    );
};

export default CourseList;