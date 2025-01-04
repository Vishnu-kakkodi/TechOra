import React, { useState, useEffect } from 'react';
import { Trophy, Award, User, Clock, BookOpen } from 'lucide-react';
import ReactStars from 'react-stars';
import { CourseDocument } from 'src/types/courseType';

interface HeroProps {
  courses: CourseDocument[];
}

const Hero4: React.FC<HeroProps> = ({ courses }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % courses.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [courses.length]);

  const getVisibleCourses = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (activeIndex + i) % courses.length;
      result.push({ course: courses[index], position: i });
    }
    return result;
  };

  const getCardStyles = (position: number) => {
    const baseStyles = "absolute transition-all duration-700 ease-in-out";
    
    switch (position) {
      case 0: // Left card
        return `${baseStyles} left-0 transform -translate-x-16 scale-75 opacity-70`;
      case 1: // Center card
        return `${baseStyles} left-1/2 transform -translate-x-1/2 scale-100 z-20 opacity-100`;
      case 2: // Right card
        return `${baseStyles} right-0 transform translate-x-16 scale-75 opacity-70`;
      default:
        return baseStyles;
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          Popular Courses
        </h2>
        
        <div className="relative h-[350px] mx-auto max-w-4xl">
          <div className="absolute inset-0 flex items-center justify-center">
            {getVisibleCourses().map(({ course, position }) => (
              <div
                key={course?.id}
                className={getCardStyles(position)}
              >
                <div className="bg-white border border-gray-200 overflow-hidden shadow-lg w-72">
                  <div className="relative">
                    <img
                      src={course?.thumbnail}
                      alt={course?.title}
                      className="w-full h-36 object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {course?.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-xs">
                        <User size={12} className="mr-1 text-gray-500" />
                        <span>{course?.tutorId?.tutorname}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                      {course?.description}
                    </p>

                    <div className="flex items-center space-x-1 mb-2">
                      <ReactStars
                        count={5}
                        value={course?.averageRating}
                        size={16}
                        edit={false}
                        color1={"#d1d5db"}
                        color2={"#facc15"}
                      />
                      <span className="text-yellow-700 font-semibold text-xs">
                        {course?.averageRating} ({course?.totalReviews})
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-xs text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1 text-blue-500" />
                        <span>{course?.duration}w</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen size={12} className="mr-1 text-green-500" />
                        <span>{course?.level}</span>
                      </div>
                      <div className="flex items-center">
                        <User size={12} className="mr-1 text-purple-500" />
                        <span>{course?.enrolledStudents}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-blue-700">
                        ₹{course?.price.toFixed(2)}
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
  );
};

export default Hero4;