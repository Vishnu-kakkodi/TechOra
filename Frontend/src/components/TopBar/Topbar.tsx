import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Topbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-white shadow-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-[1000px] rounded-md px-6 py-4 my-8 ml-[50px]">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">
          We found <span className="text-red-800 font-bold">200</span> courses for you.
        </span>
        <div className="relative flex items-center space-x-2">
          <span className="text-red-700 font-medium">Sort By:</span>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md flex items-center space-x-2"
            onClick={toggleDropdown}
          >
            <span>Default</span>
            {/* <FaChevronDown
              className={`text-gray-500 transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            /> */}
          </button>
          {isDropdownOpen && (
            <div
              className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
              style={{ marginTop: '0.5rem' }} 
            >
              <div className="py-1">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Newest
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Oldest
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Price: Low to High
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Price: High to Low
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
