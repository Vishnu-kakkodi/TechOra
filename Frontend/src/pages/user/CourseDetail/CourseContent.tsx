import React from 'react';
import { PlayCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface CourseContentProps {
  course: any;
  isVideoPlaying: boolean;
  currentVideo: string | null;
  handleVideoEnd: () => void;
  toggleModule: (moduleId: number) => void;
  activeModule: number | null;
  handleVideoSelect: (video: string, courseId: string) => void;
}

const CourseContent: React.FC<CourseContentProps> = ({
  course,
  isVideoPlaying,
  currentVideo,
  handleVideoEnd,
  toggleModule,
  activeModule,
  handleVideoSelect
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="aspect-w-16 aspect-h-9">
            {isVideoPlaying && currentVideo ? (
              <video
                src={currentVideo}
                controls
                onEnded={handleVideoEnd}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={course?.thumbnail}
                alt={course?.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">{course?.title}</h1>
            <p className="text-gray-600">{course?.description}</p>
          </div>
        </div>
        <div className="lg:col-span-1 p-4">
          <h2 className="text-xl font-bold mb-4">Course Content</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {course?.modules.map((module: any) => (
              <div
                key={module.id}
                className="bg-gray-50 rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <PlayCircle
                        className="w-6 h-6 text-blue-600 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoSelect(module.video, course._id);
                        }}
                      />
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-sm text-gray-500">{module.duration}</p>
                      </div>
                    </div>
                    {activeModule === module.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
                {activeModule === module.id && (
                  <div className="p-4 bg-gray-100">
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;

