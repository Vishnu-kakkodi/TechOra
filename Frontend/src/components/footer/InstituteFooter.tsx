import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const InstituteFooter: React.FC = () => {
  const instituteData = useSelector((state: RootState) => state.auth.institutionInfo);

  return (
    <footer className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 text-white py-6">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/dashboard" className="hover:text-blue-200">Dashboard</a></li>
            <li><a href="/courses" className="hover:text-blue-200">Courses</a></li>
            <li><a href="/tutors" className="hover:text-blue-200">Tutors</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Contact Information</h3>
          <p>{instituteData?.collegeName}</p>
          <p>Email: {instituteData?.instituteEmail}</p>
        </div>
        <div>
          <h3 className="font-bold mb-3">Institution Stats</h3>
          <p>Total Courses: {/* Add dynamic course count */}</p>
          <p>Total Tutors: {/* Add dynamic tutor count */}</p>
        </div>
      </div>
      <div className="text-center mt-6 border-t border-blue-700 pt-4">
        <p>&copy; {new Date().getFullYear()} {instituteData?.collegeName}. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default InstituteFooter