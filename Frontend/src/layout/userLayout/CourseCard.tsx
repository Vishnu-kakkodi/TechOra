import React from 'react';
import { User, Clock, BookOpen } from 'lucide-react';
import ReactStars from 'react-stars';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    tutorId: { tutorname: string };
    description: string;
    averageRating: number;
    totalReviews: number;
    duration: number;
    level: string;
    enrolledStudents: number;
    price: number;
    thumbnail: string;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 truncate">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center mb-4">
          <User size={16} className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">{course.tutorId.tutorname}</span>
        </div>
        <div className="flex items-center mb-4">
          <ReactStars
            count={5}
            value={course.averageRating}
            size={18}
            color2="#ffd700"
            edit={false}
          />
          <span className="ml-2 text-sm text-gray-600">
            ({course.totalReviews} reviews)
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            {course.duration} weeks
          </div>
          <div className="flex items-center">
            <BookOpen size={16} className="mr-1" />
            {course.level}
          </div>
          <div>{course.enrolledStudents} students</div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">₹{course.price.toFixed(2)}</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

