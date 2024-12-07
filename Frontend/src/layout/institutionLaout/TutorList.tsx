import React, { useState } from 'react';
import { 
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTutorListQuery } from '../../store/slices/institutionSlice';
import profile from '../../assets/frontEnd/ProfilePic.png'

interface Tutor {
  id: string;
  tutorname: string;
  department: string;
  education: string;
  gender: string;
  experiance: string;
  photoUrl?: string;
}

interface TutorListProps {
  itemsPerPage?: number;
}

const TutorList: React.FC<TutorListProps> = ({ itemsPerPage = 10 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: { institutes } = { institutes: [] }} = useTutorListQuery(null);

  const filteredTutors = institutes?.filter((tutor: Tutor) => 
    tutor.tutorname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.department.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil((filteredTutors?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTutors = filteredTutors.slice(startIndex, endIndex);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow flex flex-col min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Tutors List</h2>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search tutors..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Photo</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 flex-grow">
            {currentTutors.length > 0 ? (
              currentTutors.map((tutor: Tutor) => (
                <tr key={tutor.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <img
                      src={profile || `/api/placeholder/40/40`}
                      alt={tutor.tutorname}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">{tutor.tutorname}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">{tutor.department}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">{tutor.education}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">{tutor.gender}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">{tutor.experiance}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
              <td colSpan={6} className="py-4 px-6 text-center text-gray-500 flex-grow">
                <div className="flex flex-col items-center justify-center py-12">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 text-gray-300 mb-4"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {searchTerm ? 'No tutors found' : 'No tutors available'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? `No results match "${searchTerm}"` 
                      : 'Start by adding a new tutor'
                    }
                  </p>
                </div>
              </td>
            </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, filteredTutors.length)}</span> of{' '}
              <span className="font-medium">{filteredTutors.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                    ${currentPage === pageNum 
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorList;