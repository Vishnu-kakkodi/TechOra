import React from "react";
import LogoutButton from "../buttons/LogoutButton";
import SearchBar from "../search/SearchBar";

const Navbar = () => {

    const searchData = ["Course", "Quiz"];
    return (
        <>
            <header className="bg-custom-gradient shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <span className="text-[35px] text-yellow-500 font-bold">techOra</span>
                            <span className="text-[10px] text-white block mt-0 pt-0 ml-1 mb-2">Let's Build Your Future</span>
                        </div>
                        <SearchBar data={searchData} />

                        <nav className="flex space-x-8">
                            <a
                                className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md 
                  text-sm font-medium transition-colors duration-200"
                            >
                                Course
                            </a>
                            <a
                                className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md 
                  text-sm font-medium transition-colors duration-200"
                            >
                                Quiz
                            </a>
                            <a
                                className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md 
                  text-sm font-medium transition-colors duration-200"
                            >
                                Resources
                            </a>
                            <a
                                className="text-white font-jakarta hover:text-yellow-300 px-3 py-2 rounded-md 
                  text-sm font-medium transition-colors duration-200"
                            >
                                About
                            </a>
                        </nav>
                        <div>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Navbar;