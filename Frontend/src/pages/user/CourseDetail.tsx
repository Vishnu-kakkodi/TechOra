import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  Plus
} from 'lucide-react';
import InstituteSidebar from '../../components/sidebar/InstituteSidebar';
import { useCoursedetailQuery, useCourseReviewMutation, useMyCoursesQuery, useReviewQuery } from '../../store/slices/userSlice';
import Navbar from '../../components/header/Navbar';
import { CourseDocument } from '../../types/courseType';
import { toast } from 'react-toastify';
import ProfilePic from '../../assets/frontEnd/ProfilePic.png'
import ReactStars from 'react-stars';
import Footer from '../../components/footer/Footer';
import useDebouncedValue from '../../hooks/debounceHook';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ChatModal from '../../components/modals/User/ChatModal';


const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [myCourse, setMycourse] = useState<string | null>(null)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebouncedValue(search, 500);
  const [purchased, setPurchased] = useState<boolean>(false);
  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);
  const [courseReview] = useCourseReviewMutation();
  const [isChatOpen, setIsChatOpen] = useState(false);



  const [currentValue, setCurrentValue] = React.useState<number | undefined>(0);
  const [reviewText, setReviewText] = React.useState<string>("");

  const { data: courseData, isLoading, isError } = useCoursedetailQuery(courseId as string);


  const courseIDs: string[] = courseData?.purchased || [];

  let course = courseData?.Data;

  const { data: Review } = useReviewQuery(courseId as string);

  console.log(courseData?.purchased, "purchasedsed")



  const handleSubmitReview = async () => {
    if (!reviewText || !currentValue) {
      alert("Please provide a rating and a review!");
      return;
    }

    let courseId: string | undefined = course?._id

    const response = await courseReview({ currentValue, reviewText, courseId })

    setReviewText("");
    setCurrentValue(undefined);
    setIsAddingReview(false);
  };



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching course data.</div>;
  }

  if (!courseData || !courseData.Data) {
    return <div>No course data available.</div>;
  }


  const toggleModule = (moduleId: number) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const handleVideoSelect = (video: string, courseId: string) => {
    console.log(courseId, courseIDs);
    if (courseIDs.includes(courseId)) {
      setCurrentVideo(video);
      setIsVideoPlaying(true);
    } else {
      toast.warning("Purchase this course")
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  return (
    <>
      <Navbar />
      <div className='flex'>
        <div className="container mx-auto p-6 max-w-7xl">
          {courseIDs.includes(courseId) && (
            <div className='flex justify-between mb-4'>
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course List
              </button>

              <div className="relative">
                <motion.button
                  className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 5,
                      ease: "easeInOut"
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.div>
                  <span className="relative z-10">Chat Us</span>
                </motion.button>

                <ChatModal
                  isOpen={isChatOpen}
                  onClose={() => setIsChatOpen(false)}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                </div>
              </div>
              <div className="bg-white overflow-hidden mb-6 border-2 border-black-100">
                {isVideoPlaying && currentVideo ? (
                  <video
                    src={currentVideo}
                    controls
                    onEnded={handleVideoEnd}
                    className="w-[700px] h-[400px] object-cover"
                  />
                ) : (
                  <img
                    src={course?.thumbnail}
                    alt={course?.title}
                    className="w-[700px] h-[400px] object-cover"
                  />
                )}
              </div>

              {/* Instructor Details - Right Side */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border-2 p-6">
                  <h3 className="text-lg font-bold mb-4">Instructor Details</h3>
                  <div className="flex items-center space-x-4">
                    <img
                      src={ProfilePic}
                      alt={course?.instructor}
                      className="w-16 h-16"
                    />
                    <div>
                      <p className="font-medium">{course?.instructor}</p>
                      <p className="text-sm text-gray-500">{course?.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div className="lg:col-span-2">
              <div className="bg-white border-2 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Course Modules</h2>
                <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {course?.modules.map((module: any) => (
                    <div
                      key={module.id}
                      className="bg-gray-50 rounded-lg overflow-hidden mb-2 last:mb-0"
                    >
                      <div
                        className="p-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <PlayCircle
                              className="w-6 h-6 text-blue-600"
                              onClick={() => handleVideoSelect(module.video, course._id)}
                            />
                            <div>
                              <h3 className="font-medium">{module.title}</h3>
                              <p className="text-sm text-gray-500">{module.duration}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>


          </div>
          <div className="grid grid-cols-1 lg:grid gap-6">
            <div className="lg:col-span-1">
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Ratings & Reviews</h2>
                  </div>
                  <button
                    onClick={() => setIsAddingReview(!isAddingReview)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Review
                  </button>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-3xl font-bold text-yellow-500">
                    {Review?.data?.response?.averageRating || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on <span className="font-medium">{Review?.data?.total || 0}</span> reviews
                  </div>
                </div>

                {isAddingReview && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-md">
                    <h4 className="text-md font-semibold mb-2">Leave a Review</h4>

                    <div className="flex items-center space-x-2 mb-4">
                      <ReactStars
                        count={5}
                        value={currentValue}
                        onChange={(newValue: number | undefined) => setCurrentValue(newValue)}
                        size={24}
                        color2={'#ffd700'}
                      />
                      <span className="text-gray-600">({currentValue || "Rate this course"})</span>
                    </div>

                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your review here..."
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={handleSubmitReview}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Submit Review
                      </button>
                      <button
                        onClick={() => setIsAddingReview(false)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h4 className="text-md font-semibold mb-2">What Others Are Saying</h4>
                  {Review?.data?.response?.userReviews && Review.data.response.userReviews.length > 0 ? (
                    <ul className="space-y-4">
                      {Review.data.response.userReviews.map((review, index) => (
                        <li key={index} className="border-b pb-4">
                          <div className="flex justify-between">
                            <h5 className="text-sm font-bold">
                              {review.userId?.userName || "Anonymous User"}
                            </h5>
                            <ReactStars
                              count={5}
                              value={review.rating}
                              size={16}
                              edit={false}
                              color2={'#ffd700'}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      No reviews yet. Be the first to review this course!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetail;