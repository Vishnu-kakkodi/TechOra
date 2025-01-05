import React from 'react';
import { ArrowLeft, BookOpen, Clock, MessageCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { CourseDocument } from 'src/types/courseType';

interface CourseHeaderProps {
  course: CourseDocument;
  courseIDs: string[];
  courseId: string | undefined;
  setIsChatOpen: (isOpen: boolean) => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ course, courseIDs, courseId, setIsChatOpen }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className='flex justify-between items-center mb-4'>
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course List
        </button>

        {courseIDs?.includes(courseId as string) && (
          <motion.button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg overflow-hidden transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsChatOpen(true)}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat with Instructor</span>
          </motion.button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {course?.duration} weeks</span>
        <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {course?.enrolledStudents} students</span>
        <span className="flex items-center"><BookOpen className="w-4 h-4 mr-1" /> Medium</span>
      </div>
    </div>
  );
};

export default CourseHeader;

