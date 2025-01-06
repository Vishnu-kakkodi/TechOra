import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAddToCartMutation, useAddToWishlistMutation, useHomeDataQuery } from '../../../store/slices/userSlice';
import { useAppSelector } from '../../../store/hook';
import { ApiError } from '../../../types/ApiError';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import LogoutButton from '../../../components/buttons/LogoutButton';
import { BookOpen, Clock, Heart, Languages, Menu, User, X } from 'lucide-react';
import HOMEPIC from '../../../assets/frontEnd/HOMEPIC.png';
import QuizPic from '../../../assets/frontEnd/Quiz.jpg'
import ReactStars from 'react-stars';
import LanguageSelectModal from '../../../components/modals/LanguageSelectModal';
import Footer from '../../../components/footer/Footer';
import Navbar from '../../../components/header/Navbar';
import Hero from '../../../layout/userLayout/Hero';
import Hero1 from '../../../layout/userLayout/Hero1';
import Hero4 from '../../../layout/userLayout/Hero4';
import Hero3 from '../../../layout/userLayout/Hero3';
import Hero2 from '../../../layout/userLayout/Hero2';
import { CourseDocument } from 'src/types/courseType';

const UserHome = () => {

  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);
  const [addTocart] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();

  const navigate = useNavigate();
  const isLoggedIn = true;


  const userdata = useAppSelector((state) => state.auth.userInfo);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  const { data: homeData } = useHomeDataQuery(null);
  const courses: CourseDocument[] = homeData?.data?.courses?.course || [];
  const winners = homeData?.data?.winners?.quizWinners || [] as any;



  useEffect(() => {
    if (isLoggedIn) {
      window.history.pushState(null, '', window.location.href);

      const handlePopState = (event: PopStateEvent) => {
        window.history.pushState(null, '', window.location.href);
        alert("Back navigation is disabled when you're logged in.");
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isLoggedIn]);

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

  const wishlist = async (courseId: string) => {
    try {
      const response: any = await addToWishlist({ courseId }).unwrap();
      if (response) {
        toast.success(response.message);
      }
    } catch (error: unknown) {
      const ApiError = error as ApiError;
      toast.error(ApiError.data.message);
    }
  };
  return (
    <div>
      <div>
        {/* Hero Section with Background Image */}
        <div className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col">
          <Navbar/>

          {/* Hero Section */}
          <Hero/>

          <Hero1/>

          
        </div>

        <Hero3 winners={winners} />

        <div className="container mt-10 px-4 sm:px-6 lg:px-8">
          <div className="bg-black rounded-lg shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl text-white md:text-4xl font-bold text-gray-800 mb-4">
                Test Your Knowledge!
              </h2>
              <p className="text-lg text-white mb-6">
                Challenge yourself with our interactive quizzes and climb the leaderboard.
              </p>
              <Link
                to="/quiz"
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                Start a Quiz Now
              </Link>
            </div>
            <div className="w-full md:w-1/3">
              <img
                src={QuizPic}
                alt="Quiz Illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>


        {/* Courses Section */}
        <div className="bg-gray-50 py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Title */}
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gray-800">
              Popular Courses
            </h2>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {courses.map((course: CourseDocument) => (
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
                      <div className='flex justify-between gap-2'>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
                          {course.title}
                        </h3>
                        <button onClick={() => wishlist(course._id)} className=''>
                          <Heart className="text-red-500" size={24} />
                        </button>
                      </div>
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
                        <Clock
                          size={14} className="mr-1 text-blue-500" />
                        <span>{course.duration} Weeks</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen size={14} className="mr-1 text-green-500" />
                        <span>Medium</span>
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
            </div>
          </div>
        </div>

        <Hero2/>


      </div>

      <Footer />

      {isLanguageModalOpen && (
        <LanguageSelectModal
          setLanguageModalOpen={setLanguageModalOpen}
        />
      )}
    </div>
  )
}

export default UserHome