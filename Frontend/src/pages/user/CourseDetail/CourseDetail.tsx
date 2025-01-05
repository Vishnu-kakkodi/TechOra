import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CourseHeader from './CourseHeader';
import CourseContent from './CourseContent';
import InstructorDetails from './InstructorDetails';
import ReviewSection from './ReviewSection';
import useDebouncedValue from '../../../hooks/debounceHook';
import { useCoursedetailQuery, useCourseReviewMutation, useReviewQuery } from '../../../store/slices/userSlice';
import { useAppSelector } from '../../../store/hook';
import Navbar from '../../../components/header/Navbar';
import ChatModal from '../../../components/modals/User/ChatModal';
import Footer from '../../../components/footer/Footer';
import { CourseDocument } from 'src/types/courseType';

interface LastMessage {
  message: string;
  timestamp: number;
  userId: string;
}

interface courseDetail{
  purchasedCourses: string[];
  course: CourseDocument;
}


const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebouncedValue(search, 500);
  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);
  const [courseReview] = useCourseReviewMutation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [currentValue, setCurrentValue] = React.useState<number | undefined>(0);
  const [reviewText, setReviewText] = React.useState<string>("");
  const userdata = useAppSelector((state) => state.auth.userInfo);
  const [lastMessages, setLastMessages] = useState<Record<string, LastMessage>>({});
  

  const { data: courseData, isLoading, isError } = useCoursedetailQuery(courseId as string);
  const Data: courseDetail = courseData?.data ?? { purchasedCourses: [] as string[], course: {} as CourseDocument };

  const courseIDs = Data.purchasedCourses
  const course = Data.course;

  

  const { data: Review } = useReviewQuery(courseId as string);

  const handleDataFromChild = (data: { message: string; timestamp: number }, userId: any) => {
    setLastMessages(prev => ({
      ...prev,
      [userId]: {
        message: data.message,
        timestamp: data.timestamp,
        userId
      }
    }));
  };

  const handleSubmitReview = async () => {
    if (!reviewText || !currentValue) {
      toast.error("Please provide a rating and a review!");
      return;
    }

    let courseId: string | undefined = course?._id

    const response = await courseReview({ currentValue, reviewText, courseId })

    setReviewText("");
    setCurrentValue(undefined);
    setIsAddingReview(false);
    toast.success("Review submitted successfully!");
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error fetching course data.</div>;
  }

  if (!courseData || !courseData.data) {
    return <div className="flex justify-center items-center h-screen">No course data available.</div>;
  }

  const toggleModule = (moduleId: number) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const handleVideoSelect = (video: string, courseId: string) => {
    if (courseIDs?.includes(courseId)) {
      setCurrentVideo(video);
      setIsVideoPlaying(true);
    } else {
      toast.warning("Please purchase this course to access the video content.");
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <CourseHeader 
          course={course} 
          courseIDs={courseIDs} 
          courseId={courseId} 
          setIsChatOpen={setIsChatOpen} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <CourseContent 
              course={course} 
              isVideoPlaying={isVideoPlaying} 
              currentVideo={currentVideo} 
              handleVideoEnd={handleVideoEnd} 
              toggleModule={toggleModule} 
              activeModule={activeModule} 
              handleVideoSelect={handleVideoSelect} 
            />
          </div>
          
          <div className="lg:col-span-1">
            <InstructorDetails course={course} />
          </div>
        </div>
        
        <ReviewSection 
          Review={Review} 
          isAddingReview={isAddingReview} 
          setIsAddingReview={setIsAddingReview} 
          currentValue={currentValue} 
          setCurrentValue={setCurrentValue} 
          reviewText={reviewText} 
          setReviewText={setReviewText} 
          handleSubmitReview={handleSubmitReview} 
        />
      </div>
      
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        token={userdata?.accessToken}
        senderId={userdata?._id}
        receiverId={course?.tutorId?._id}
        receiverName={course?.tutorId?.tutorname} 
        receiverProfilePhoto={course?.tutorId?.profilePic}
        currentUserType='user'
        sendDataToParent={(data) => handleDataFromChild(data, course?.tutorId?._id)}

      />
      
      <Footer />
    </div>
  );
};

export default CourseDetail;

