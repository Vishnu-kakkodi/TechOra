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
import profile from '../../assets/frontEnd/ProfilePic.png'
import TutorSidebar from '../../components/sidebar/tutorSidebar';
import { useCoursedetailQuery } from '../../store/slices/tutorSlice';

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

  if (!courseData || !courseData.Data) {
    return <div>No course data available.</div>;
  }

  const course = courseData.Data;

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
      <TutorSidebar />
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
                className="w-[600px] h-[300px] object-cover"              />
            ) : (
              <img 
                src={course.thumbnail}
                alt={course.title}
                className="w-[600px] h-[300px] object-cover"              />
            )}
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              {/* <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                data students enrolled
              </div> */}
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {course.duration}
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
            {course.modules.map((module: any) => (
              <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleModule(module.id)}
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
              <h3 className="text-lg font-bold mb-2">Instructor</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={profile}
                  alt={course.instructor}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-medium">{course.instructor}</p>
                  <p className="text-sm text-gray-500">{course.department}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Course</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Modules</span>
                  <span className="font-medium">{course.modules.length}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.status}
                  </span>
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