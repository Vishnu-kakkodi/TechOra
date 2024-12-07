// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, X } from 'lucide-react';
// import LogoutButton from '../buttons/LogoutButton';
// import SearchBar from '../search/SearchBar';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const searchData = ['Course', 'Quiz'];

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <header className="bg-custom-gradient from-blue-500 to-blue-600 shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center space-x-4">
//             <div className="flex-shrink-0">
//               <Link to="/" className="block">
//                 <span className="text-2xl md:text-[35px] text-yellow-400 font-bold tracking-tight">
//                   techOra
//                 </span>
//                 <span className="text-[8px] md:text-[10px] text-white block -mt-1 ml-1">
//                   Let's Build Your Future
//                 </span>
//               </Link>
//             </div>
//             <div className="hidden md:block">
//               <SearchBar data={searchData} />
//             </div>
//           </div>

//           <nav className="hidden md:flex items-center space-x-6">
//             {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
//               <Link
//                 key={item}
//                 to={`/${item.toLowerCase()}`}
//                 className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
//               >
//                 {item}
//               </Link>
//             ))}
//             <div className="ml-4">
//               <LogoutButton />
//             </div>
//           </nav>

//           <div className="md:hidden flex items-center">
//             <button
//               onClick={toggleMenu}
//               className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-blue-700 transition duration-150 ease-in-out"
//             >
//               {isOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//         <div
//           className={`${
//             isOpen ? 'block' : 'hidden'
//           } md:hidden transition-all duration-300 ease-in-out`}
//         >
//           <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-600 rounded-lg mt-2 shadow-lg">
//             <div className="pb-2">
//               <SearchBar data={searchData} />
//             </div>
//             {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
//               <Link
//                 key={item}
//                 to={`/${item.toLowerCase()}`}
//                 className="text-white hover:text-yellow-300 hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
//                 onClick={() => setIsOpen(false)}
//               >
//                 {item}
//               </Link>
//             ))}
//             <div className="pt-2">
//               <LogoutButton />
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, X } from 'lucide-react';
import LogoutButton from '../buttons/LogoutButton';
import SearchBar from '../search/SearchBar';
import { useAppSelector } from '../../store/hook';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchData = ['Course', 'Quiz'];
  const userdata = useAppSelector((state) => state.auth.userInfo);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-custom-gradient from-blue-500 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link to="/" className="block">
                <span className="text-2xl md:text-[35px] text-yellow-400 font-bold tracking-tight">
                  techOra
                </span>
                <span className="text-[8px] md:text-[10px] text-white block -mt-1 ml-1">
                  Let's Build Your Future
                </span>
              </Link>
            </div>
            {/* <div className="hidden md:block">
              <SearchBar data={searchData} />
            </div> */}
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                {item}
              </Link>
            ))}
            <div className="ml-4">
              <LogoutButton />
            </div>
              {userdata?.profilePhoto ? (
                <img
                  src={userdata.profilePhoto}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center ring-2 ring-white">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:hidden transition-all duration-300 ease-in-out`}
        >
            {userdata?.profilePhoto ? (
              <img
                src={userdata.profilePhoto}
                alt="User Profile"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center ring-2 ring-white">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-600 rounded-lg mt-2 shadow-lg">
            <div className="pb-2">
              <SearchBar data={searchData} />
            </div>
            {['Course', 'Quiz', 'Leaderboard', 'Cart', 'Account'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-white hover:text-yellow-300 hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="pt-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;