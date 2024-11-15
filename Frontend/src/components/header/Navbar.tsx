import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../buttons/LogoutButton';
import SearchBar from '../search/SearchBar';

const Navbar = () => {
  const searchData = ['Course', 'Quiz'];

  return (
    <header className="bg-blue-400 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Link to="/">
              <span className="text-[35px] text-yellow-500 font-bold">techOra</span>
              <span className="text-[10px] text-white block mt-0 pt-0 ml-1 mb-2">Let's Build Your Future</span>
            </Link>
          </div>
          <SearchBar data={searchData} />
        </div>
        <nav className="flex items-center space-x-8">
          <Link to="/course" className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
            Course
          </Link>
          <Link to="/quiz" className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
            Quiz
          </Link>
          <Link to="/resources" className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
            Leaderboard
          </Link>
          <div className="ml-4">
            <LogoutButton />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;