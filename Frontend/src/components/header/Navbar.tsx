
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Languages, Menu, User, X } from 'lucide-react';
import LogoutButton from '../buttons/LogoutButton';
import SearchBar from '../search/SearchBar';
import { useAppSelector } from '../../store/hook';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchData = ['Course', 'Quiz'];
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);

  const userdata = useAppSelector((state) => state.auth.userInfo);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (

    <header className="w-full top-0 shadow-lg bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl md:text-[35px] text-black font-bold tracking-tight leading-tight">
                TechOra
              </span>
              <span className="text-[8px] md:text-[10px] text-black/80 -mt-1 ml-1">
                Let's Build Your Future
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-gray-800 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-100"
              >
                {item}
              </Link>
            ))}

            {/* Buttons and Language Selector */}
            <div className="flex items-center space-x-4">
              <LogoutButton/>
              <button
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Logout"
              >
              </button>

              <button
                className="border-2 border-black p-2 rounded-md hover:bg-yellow-400 transition-colors"
                onClick={() => setLanguageModalOpen(true)}
                aria-label="Change Language"
              >
                <Languages className="w-5 h-5" />
              </button>

              {userdata?.profilePhoto && (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={userdata.profilePhoto}
                    alt={userdata.userName || 'User profile'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-yellow-400 hover:bg-gray-100 transition"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;