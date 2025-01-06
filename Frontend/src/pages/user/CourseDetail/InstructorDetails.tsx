import React from 'react';
import { CourseDocument } from 'src/types/courseType';

interface InstructorDetailsProps {
  course: CourseDocument;
}

const InstructorDetails: React.FC<InstructorDetailsProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Instructor Details</h3>
      <div className="flex items-center space-x-4">
        <img
          src={course?.tutorId?.profilePic}
          alt={course?.tutorId?.tutorname}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="font-medium">{course?.tutorId?.tutorname}</p>
          <p className="text-sm text-gray-500">{course?.tutorId?.department}</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">
      <h4 className="font-medium mb-2">About the Instructor</h4>
      
      <div className="space-y-3 text-sm text-gray-600">

        {/* Education Section */}
        <div>
          <h5 className="font-medium text-gray-800 mb-1">Education</h5>
          {course?.tutorId?.education ? (
            <ul className="list-disc pl-4">
                <li>{course?.tutorId?.education}</li>
            </ul>
          ) : (
            <p>Education details not available</p>
          )}
        </div>

        {/* Experience Section */}
        <div>
          <h5 className="font-medium text-gray-800 mb-1">Experience</h5>
          {course?.tutorId?.experiance ? (
            <ul className="list-disc pl-4">
                <li>{course?.tutorId?.experiance} Year's of Experiance</li>
            </ul>
          ) : (
            <p>Experience details not available</p>
          )}
        </div>

        {/* Gender Section */}
        {course?.tutorId?.gender && (
          <div>
            <h5 className="font-medium text-gray-800 mb-1">Gender</h5>
            <p className="capitalize">{course?.tutorId?.gender }</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default InstructorDetails;

