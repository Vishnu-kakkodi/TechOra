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
import { Course, CourseDocument } from '../../types/courseType';

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
      <InstituteSidebar />
      <div className="container mx-auto p-6 max-w-7xl">
      {/* Back Button */}
      <button 
        onClick={() => window.history.back()}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Course List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Player Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {isVideoPlaying && currentVideo ? (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <video 
                src={currentVideo}
                controls
                onEnded={handleVideoEnd}
                className="w-full h-full object-contain"
              />
            </div>
            ) : (
              <img 
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
            )}
          </div>

          {/* Course Info */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                data students enrolled
              </div>
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

          {/* Course Modules */}
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
                      <PlayCircle className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-sm text-gray-500">{module.duration}</p>
                      </div>
                    </div>
                    {activeModule === module.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
                {activeModule === module.id && (
                  <div className="border-t border-gray-200 p-4">
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <div className="aspect-video relative cursor-pointer group"
                         onClick={() => handleVideoSelect(module.video)}>
                      <img 
                        src={module.video}
                        alt={module.title}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 flex items-center justify-center transition-all">
                        <PlayCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Instructor</h3>
              <div className="flex items-center space-x-4">
                <img
                  src="/api/placeholder/64/64"
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
              <h3 className="text-lg font-bold">Course Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Modules</span>
                  <span className="font-medium">{course.modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Enrolled Students</span>
                  <span className="font-medium">Data</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
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