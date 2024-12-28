
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Star, CheckCircle, User, X, Menu, Languages, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactStars from 'react-stars';
import QuizPic from '../../../assets/frontEnd/Quiz.jpg'
import { useAppSelector } from '../../../store/hook';
import { useHomeDataQuery } from '../../../store/slices/userSlice';
import SignUpButton from '../../../components/buttons/SignUpButton';
import Hero from '../../../layout/userLayout/Hero';
import SignUpModal from '../../../components/modals/SignUpModal';
import LoginModal from '../../../components/modals/LoginModal';
import EmailVerify from '../../../components/modals/EmailVerify';
import OtpModal from '../../../components/modals/OtpModal';
import LanguageSelectModal from '../../../components/modals/LanguageSelectModal';
import Footer from '../../../components/footer/Footer';


interface LoginButtonProps{
    label?: string;
    className?:string;
    handleLogin?: () => void
    setModalOpen?: (state: boolean) => void;
}

const LoginButton: React.FC<LoginButtonProps>=({
    handleLogin
}) => {
    return (
        <>
        <button
        onClick={handleLogin}
        className={`ml-4 text-[14px] font-[800] capitalize text-black bg-transparent border-2 border-black hover:bg-yellow-500 hover:text-black px-[30px] py-[11px]`}>
            Log in
        </button>
        </>
    )
}


const LandingPage = () => {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isEmailVerifyOpen, setEmailVerifyOpen] = useState(false);
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);

  const [otpMode, setOtpMode] = useState<'signup' | 'verifyEmail' | 'forgotPassword'>('signup');


  const userdata = useAppSelector((state) => state.auth.userInfo);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  const { data = {} } = useHomeDataQuery(null);
  const courses = data.course || [] as any;

  const handleForgotPassword = () => {
    setLoginModalOpen(false);
    setEmailVerifyOpen(true);
    setOtpMode('forgotPassword');
  };

  const handleSignUpOtp = () => {
    setOtpMode('signup');
    setOtpModalOpen(true);
  };

  const handleOtpModalOpen = (mode: 'signup' | 'verifyEmail' | 'forgotPassword') => {
    setOtpMode(mode);
    setOtpModalOpen(true);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    console.log('Selected Language:', language);
  };


  return (
    <>
      <div>
        {/* Hero Section with Background Image */}
        <div className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col">
          <header className="w-full top-0 shadow-lg bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="flex items-center space-x-4">
                  <Link to="/" className="flex flex-col">
                    <span className="text-2xl md:text-[35px] text-black font-bold tracking-tight leading-tight">
                      TechOra
                    </span>
                    <span className="text-[8px] md:text-[10px] text-black/80 -mt-1 ml-1">
                      Let's Build Your Future
                    </span>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  {/* Buttons and Language Selector */}
                  <div className="flex space-x-4 items-center">
                    <SignUpButton handleSignUp={() => setSignUpModalOpen(true)} />
                    <LoginButton handleLogin={() => setLoginModalOpen(true)} />
                    <div
                      className="border-2 p-2 border-black rounded-md hover:bg-yellow-400 cursor-pointer"
                      onClick={() => setLanguageModalOpen(true)}
                    >
                      <Languages />
                    </div>
                  </div>
                </nav>

                {/* Mobile Menu */}
                <div className="md:hidden flex items-center">
                  <button
                    onClick={()=>setSignUpModalOpen(true)}
                    className="p-2 rounded-md text-gray-600 hover:text-yellow-400 hover:bg-gray-100 transition"
                  >Sign Up
                  </button>
                  <button
                    onClick={()=>setLoginModalOpen(true)}
                    className="p-2 rounded-md text-gray-600 hover:text-yellow-400 hover:bg-gray-100 transition"
                  >Log in
                  </button>
                </div>
              </div>
            </div>
          </header>

          <Hero/>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black rounded-lg shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl text-white md:text-4xl font-bold text-gray-800 mb-4">
                Test Your Knowledge!
              </h2>
              <p className="text-lg text-white mb-6">
                Challenge yourself with our interactive quizzes and climb the leaderboard.
              </p>
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
              {courses.map((course:any) => (
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
                        <span>{course.tutorId.tutorname}</span>
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
                        <BookOpen size={14} className="mr-1 text-green-500" />
                        <span>{course.level}</span>
                      </div>
                      <div className="flex items-center">
                        <User size={14} className="mr-1 text-purple-500" />
                        <span>{course.enrolledStudents} Enrolled</span>
                      </div>
                    </div>

                    {/* Price and Enroll Button */}
                    <div className="flex justify-between items-center">
                      <div className="text-base md:text-lg font-bold text-blue-700">
                        ₹{course.price.toFixed(2)}
                      </div>
                      {/* <button className="bg-blue-600 text-white px-4 py-2 text-sm md:text-base rounded-full hover:bg-blue-700 transition-colors">
                        Enroll Now
                      </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer/>

      {isSignUpModalOpen && (
        <SignUpModal
          setSignUpModalOpen={setSignUpModalOpen}
          setOtpModalOpen={() => handleOtpModalOpen('signup')}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal
          setLoginModalOpen={setLoginModalOpen}
          setOtpModalOpen={() => handleOtpModalOpen('verifyEmail')}
          onForgotPassword={handleForgotPassword}
        />
      )}

      {isEmailVerifyOpen && (
        <EmailVerify
          setEmailVerify={setEmailVerifyOpen}
          setOtpModalOpen={() => handleOtpModalOpen('forgotPassword')}
          mode="user"
        />
      )}

      {isOtpModalOpen && (
        <OtpModal
          setOtpModalOpen={setOtpModalOpen}
          mode={otpMode}
        />
      )}

      {isLanguageModalOpen && (
        <LanguageSelectModal
          setLanguageModalOpen={setLanguageModalOpen}
        />
      )}
    </>

  );
};

export default LandingPage;