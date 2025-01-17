import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Clock,
  Users,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import InstituteSidebar from '../../components/sidebar/InstituteSidebar';
import { useCoursedetailQuery } from '../../store/slices/institutionSlice';
import profile from '../../assets/frontEnd/ProfilePic.png'
import { CourseDocument, Module } from 'src/types/courseType';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);


  const { data: courseData, isLoading, isError } = useCoursedetailQuery(courseId as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching course data.</div>;
  }

  if (!courseData || !courseData.data) {
    return <div>No course data available.</div>;
  }

  const course: CourseDocument = courseData?.data  

  const toggleModule = (moduleId: number) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const handleVideoSelect = (video: string) => {
    setCurrentVideo(video);
    setIsVideoPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };


  return (
    <div className='flex' >
      <InstituteSidebar />
      <div className="container mx-auto p-6 max-w-7xl">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course List
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white  overflow-hidden mb-6">
              {isVideoPlaying && currentVideo ? (
                <video
                  src={currentVideo}
                  controls
                  onEnded={handleVideoEnd}
                  className="w-[600px] h-[300px] object-cover" />
              ) : (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-[600px] h-[300px] object-cover" />
              )}
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {course.duration} Week
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {course.department}
                </div>
              </div>
              <p className="text-gray-600">{course.description}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Course Modules</h2>
              {course.modules.map((module: Module) => (
                <div key={module._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleModule(Number(module._id))}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <PlayCircle
                          onClick={() => handleVideoSelect(module.video)}
                          className="w-6 h-6 text-blue-600" />
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

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Instructor Detail</h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={course?.tutorId?.profilePic}
                    alt={course?.tutorId?.tutorname}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="text-md font-semibold">{course?.tutorId?.tutorname}</h4>
                    <p className="text-sm text-gray-600">
                      Gender: <span className="font-medium">{course?.tutorId?.gender}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Department: <span className="font-medium">{course?.tutorId?.department}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Education: <span className="font-medium">{course?.tutorId?.education}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Experience: <span className="font-medium">{course?.tutorId?.experiance} years</span>
                    </p>
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

export default CourseDetail;