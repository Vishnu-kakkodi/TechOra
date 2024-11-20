import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

interface CourseSidebarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
}

const userCourseSidebar: React.FC<CourseSidebarProps> = ({ onSearch, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const courseCategories = [
    "English", "Mathematics", "Computer Science", "Physics",
    "Chemistry", "Biology", "Botany", "Economics", "Commerce"
  ];

  const popularColleges = [
    "CET", "TKM", "GEC Kannur", "Maharajas", "MCC",
    "Model", "KMCT", "MDIT", "AWH"
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-[60px] left-2 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      <div
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out bg-gray-50 
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div className="h-full overflow-y-auto pt-16 lg:pt-0">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Search</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold mb-2">Course Categories</h2>
              <div className="bg-white border rounded-lg p-4">
                {courseCategories.map((category, index) => (
                  <label key={index} className="flex items-center py-2 hover:bg-gray-50 rounded px-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-600">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold mb-2">Popular Colleges</h2>
              <div className="bg-white border rounded-lg p-4">
                {popularColleges.map((college, index) => (
                  <label key={index} className="flex items-center py-2 hover:bg-gray-50 rounded px-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-600">{college}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default userCourseSidebar;