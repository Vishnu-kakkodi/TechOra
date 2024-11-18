import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    ChevronDown,
    Heart,
    ShoppingCart
} from 'lucide-react';
import InstituteSidebar from '../../components/sidebar/InstituteSidebar';
import { useCourseListQuery } from '../../store/slices/userSlice';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/header/Navbar';
import ReactStars from 'react-stars';
import { CButton } from '@coreui/react';
import { useAddToCartMutation } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import UserCoursePage from '../../components/sidebar/CourseSidebar';
import Topbar from '../../components/TopBar/Topbar';


const CourseList = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [currentValue, setCurrentValue] = useState<number | undefined>(3);
    const [addTocart] = useAddToCartMutation();

    const { data = {} } = useCourseListQuery(null);
    const course = data.data || [];
    console.log(course, "oho");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
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
        // Implement delete functionality
        console.log('Delete course:', courseId);
    };

    const toggleDropdown = (courseId: number) => {
        setActiveDropdown(activeDropdown === courseId ? null : courseId);
    };

    const handleAddToCart = async (courseId: string) => {
        try{
            console.log(courseId,"CourseIdldjflkj")
            const response = await addTocart({courseId})
            toast.success("Successfully added to cart")
        }catch(error){
            toast.error("Failed to add")
        }
    }

    return (
        <>
            <Navbar />
            <div className='flex'>
            <UserCoursePage/>
            <div>
            <Topbar/>
            <div className='flex ml-10'>
                <div className="p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Course List</h1>
                        </div>
                    </div>

                    {/* Filters */}
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

                        {/* Department Filter */}
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

                    {/* Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[60px]">
                        {course.map((course: any) => (
                            <div
                                key={course.id}
                                className="bg-white  shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                            >
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">{course.title}</h3>
                                            <p className="text-gray-500 text-sm">{course.department}</p>
                                        </div>
                                        <div>
                                            <Heart className="text-red-500"/>
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
                                            <span className="font-medium">{course.enrolled} Students</span>
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
                                            <Link to={`/institute/course-view/${course._id}`}>
                                                <span className="px-2 py-1 rounded-full text-xs">
                                                    <span className="underline font-bold text-[13px] decoration-gray-200 decoration-2">Learn More</span>+
                                                </span>
                                            </Link>

                                        </div>
                                        <div onClick={()=>handleAddToCart(course._id)} className="bg-gray-500 text-white py-2 px-4 rounded-lg font-bold flex justify-center hover:bg-gray-600 cursor-pointer">
                                            Add To Cart
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
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