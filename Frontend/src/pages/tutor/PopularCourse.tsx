import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseListQuery } from '../../store/slices/institutionSlice';
import { CourseDocument } from 'src/types/courseType';

const PopularCourse = () => {
  const navigate = useNavigate();
  const { data = {} } = useCourseListQuery(null);
  const courses = data.data || [] as any;

  const latestCourses = [...courses]
    .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
    .slice(0, 4);

  return (
    <div className='flex'>
      <div className="p-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestCourses.map((course: CourseDocument) => (
            <div 
              key={course._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold line-clamp-1">{course.title}</h3>
                    <p className="text-gray-500 text-sm">{course.department}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Instructor</span>
                    <span className="font-medium">{course.tutorId?.tutorname}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium">{course.duration} Weeks</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Enrolled</span>
                    <span className="font-medium">{course.enrolledStudents} Students</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-500">Status</span>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCourse;