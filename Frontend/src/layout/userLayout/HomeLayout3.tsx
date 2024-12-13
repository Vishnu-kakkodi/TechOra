// // import React from 'react'
// // import landingPageIMG from '../../assets/frontEnd/landingPageIMG.png'
// import coursePic from '../../assets/frontEnd/coursePic.jpg'
// // import {
// //   ArrowRight
// // } from 'lucide-react'
// // import { useNavigate } from 'react-router-dom'
// // import HomePic from '../../assets/frontEnd/HomePic.png'

// // const HomeLayout3 = () => {

// //   const navigate = useNavigate();

// //   return (


// //     <div>
// //       {/* Divider Line */}
// //       <hr className="border-t border-gray-300" />

// //       {/* Hero Section */}
// //       <div className="container mx-auto bg-custom-blue p-4">
// //         <div className="flex items-center h-[400px]">

// //           {/* Text Content */}
// //           <div className="w-full lg:w-1/2 ml-[30px] lg:ml-[130px] mb-[20px] lg:mb-[120px] mt-[80px]">
// //             <p className="text-[28px] lg:text-[40px] font-bold text-yellow-500 mb-1 font-bebasNeue tracking-normal leading-tight">
// //               Explore Knowledge
// //             </p>
// //             <p className="text-[28px] lg:text-[40px] font-bold text-yellow-500 mb-0 font-bebasNeue tracking-normal leading-tight">
// //               Without Limits
// //             </p>
// //           </div>


// //           {/* Image Section */}
// //           <div className="w-full lg:w-1/2 flex items-center justify-center">
// //             <img
// //               src={landingPageIMG}
// //               alt="Description of the image"
// //               className="max-w-full h-auto object-contain"
// //             />
// //           </div>

// //         </div>
// //       </div>

// //       {/* Secondary Section */}
// //       <div className="container mx-auto bg-gray-400">
// //         <div className="flex items-center justify-center h-[100px]">
// //           {/* Add content here if needed */}
// //         </div>
// //       </div>
// //     </div>

// //   )
// // }

// // export default HomeLayout3




// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowRight } from 'lucide-react';

// import landingPageIMG from '../../assets/frontEnd/landingPageIMG.png';
// import coursePic from '../../assets/frontEnd/coursePic.jpg';
// import { useHomeDataQuery } from '../../store/slices/userSlice';

// const UpdatedLandingPage = () => {
//   const navigate = useNavigate();

// const { data = {} } = useHomeDataQuery(null);
// const courses = data.course || [] as any;

//   const handleExploreClick = () => {
//     navigate('/courses/ui-design-basics');
//   };

//   return (
//     <div>
//       {/* Hero Section */}
//       <div className="bg-custom-blue py-16">
//         <div className="container mx-auto flex items-center">
//           <div className="w-1/2 ml-20">
//             <h1 className="text-4xl font-bold text-yellow-500 font-bebasNeue mb-2">
//               Explore Knowledge
//             </h1>
//             <h1 className="text-4xl font-bold text-yellow-500 font-bebasNeue">
//               Without Limits
//             </h1>
//           </div>
//           <div className="w-1/2 flex justify-center">
//             <img
//               src={landingPageIMG}
//               alt="Description of the image"
//               className="max-w-full h-auto object-contain"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Popular Courses Section */}
//       <div className='flex'>
//         <div className="p-6 w-full">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {courses.map((course: any) => (
//               <div
//                 key={course._id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
//               >
//                 <img
//                   src={course.thumbnail}
//                   alt={course.title}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-4">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="text-lg font-semibold line-clamp-1">{course.title}</h3>
//                       <p className="text-gray-500 text-sm">{course.department}</p>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Instructor</span>
//                       <span className="font-medium">{course.instructor}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Duration</span>
//                       <span className="font-medium">{course.duration} Weeks</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Enrolled</span>
//                       <span className="font-medium">{course.enrolled} Students</span>
//                     </div>
//                     <div className="flex justify-between text-sm items-center">
//                       <span className="text-gray-500">Status</span>
//                       <span className={`px-2 py-1 rounded-full text-xs ${course.status === 'published'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-red-100 text-red-800'
//                         }`}>
//                         {course.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Pricing Section */}
//       <div className="bg-gray-100 py-16">
//         <div className="container mx-auto">
//           <h2 className="text-2xl font-bold mb-8">Join us and scale up your skills</h2>
//           <div className="flex justify-center">
//             <div className="bg-white shadow-md rounded-md overflow-hidden w-1/3 mr-4">
//               <div className="p-4">
//                 <h3 className="text-xl font-bold mb-2">Standard User</h3>
//                 <p className="text-4xl font-bold mb-4">$48/month</p>
//                 <ul className="list-disc list-inside mb-4">
//                   <li>5 courses a month</li>
//                   <li>10 chapters a day</li>
//                   <li>5 hours a month</li>
//                 </ul>
//                 <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full">
//                   Enroll now
//                 </button>
//               </div>
//             </div>
//             <div className="bg-white shadow-md rounded-md overflow-hidden w-1/3 ml-4">
//               <div className="p-4">
//                 <h3 className="text-xl font-bold mb-2">Premium User</h3>
//                 <p className="text-4xl font-bold mb-4">$500/year</p>
//                 <ul className="list-disc list-inside mb-4">
//                   <li>Unlimited courses a month</li>
//                   <li>Unlimited chapters a day</li>
//                   <li>Unlimited access</li>
//                 </ul>
//                 <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full">
//                   Enroll now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdatedLandingPage;



import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Star, CheckCircle, User, X, Menu } from 'lucide-react';
import { useHomeDataQuery } from '../../store/slices/userSlice';
import { CourseDocument } from '../../types/courseType';
import HomePic from '../../assets/frontEnd/HomePic.jpg'
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hook';
import LogoutButton from '../../components/buttons/LogoutButton';
import HomePic1 from '../../assets/frontEnd/landingPageIMG.png'


const UpdatedLandingPage = () => {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const userdata = useAppSelector((state) => state.auth.userInfo);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  const { data = {} } = useHomeDataQuery(null);
  const courses = data.course || [] as any;

  // const courses = [
  //   {
  //     id: 1,
  //     title: "UI/UX Design Mastery",
  //     instructor: "Sarah Thompson",
  //     duration: 8,
  //     enrolled: 1250,
  //     thumbnail: "/api/placeholder/400/250",
  //     difficulty: "Intermediate",
  //     price: 49.99
  //   },
  //   {
  //     id: 2,
  //     title: "Web Development Bootcamp",
  //     instructor: "Michael Chen",
  //     duration: 12,
  //     enrolled: 2100,
  //     thumbnail: "/api/placeholder/400/250",
  //     difficulty: "Advanced",
  //     price: 79.99
  //   },
  //   {
  //     id: 3,
  //     title: "Digital Marketing Strategies",
  //     instructor: "Emma Rodriguez",
  //     duration: 6,
  //     enrolled: 950,
  //     thumbnail: "/api/placeholder/400/250",
  //     difficulty: "Beginner",
  //     price: 39.99
  //   }
  // ];

  return (
    <div>
      {/* Hero Section with Background Image */}
      <div
        className=" bg-cover bg-center bg-no-repeat min-h-screen items-center"
        style={{
          backgroundImage: `url(${HomePic})`,
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0,0,0,0.6)'
        }}
      >
        <header className="w-full top-0 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex flex-col">
                  <span className="text-2xl md:text-[35px] text-yellow-400 font-bold tracking-tight leading-tight">
                    TechOra
                  </span>
                  <span className="text-[8px] md:text-[10px] text-white/80 -mt-1 ml-1">
                    Let's Build Your Future
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="text-white/90 font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white/10"
                  >
                    {item}
                  </Link>
                ))}
                <div className="flex space-x-10">
                  <LogoutButton />
                  {userdata?.profilePhoto ? (
                    <img
                      src={userdata.profilePhoto}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-700/50 flex items-center justify-center ring-2 ring-white">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </nav>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-blue-700/20 transition duration-150 ease-in-out"
                >
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            <div
              className={`${isOpen ? 'block' : 'hidden'
                } md:hidden transition-all duration-300 ease-in-out bg-blue-600/80 backdrop-blur-md rounded-lg shadow-lg`}
            >
              <div className="flex justify-center py-4">
                {userdata?.profilePhoto ? (
                  <img
                    src={userdata.profilePhoto}
                    alt="User Profile"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-white"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-700/50 flex items-center justify-center ring-2 ring-white">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="text-white hover:text-yellow-300 hover:bg-blue-700/30 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <div className="pt-2">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className='flex'>
        <div className="container mt-[150px] px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl font-bold mb-6 text-white">
              Unlock Your Potential
            </h1>
            <p className="text-2xl mb-8 text-gray-200">
              Dive into transformative learning experiences that empower your personal and professional growth.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500 text-black px-8 py-4 rounded-full flex items-center space-x-3 text-lg font-semibold hover:bg-yellow-600 transition"
            >
              <span>Start Your Journey</span>
              <ArrowRight size={24} />
            </motion.button>
          </motion.div>
        </div>
        <div className="flex items-end justify-end w-full h-[700px]">
            <img src={HomePic1} alt="Description of the image" className="w-[957px] h-full" />
        </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Popular Courses
          </h2>
          <div className="grid grid-cols-4 gap-8">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.12)"
                }}
                onHoverStart={() => setHoveredCourse(course.id)}
                onHoverEnd={() => setHoveredCourse(null)}
                className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                    {course.department}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-indigo-800">
                    {course.title}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <PlayCircle size={16} />
                      <span>{course.duration} Weeks</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star size={16} className="text-yellow-500" />
                      <span>1200 Enrolled</span>
                    </div>
                  </div>
                  {hoveredCourse === course.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 space-y-2"
                    >
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle size={16} />
                        <span>Lifetime Access</span>
                      </div>
                      <button className="w-full bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700 transition flex items-center justify-center space-x-2">
                        <span>Enroll Now</span>
                        <ArrowRight size={16} />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatedLandingPage;