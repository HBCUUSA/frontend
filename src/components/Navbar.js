import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext for user info

const Navbar = () => {
  const { user, logout } = useAuth(); // Get current user info and logout function
  const navigate = useNavigate();

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  // Profile Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Add Program Dropdown State
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
  const programDropdownRef = useRef(null);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (programDropdownRef.current && !programDropdownRef.current.contains(event.target)) {
        setIsProgramDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-blue-800 dark:bg-gray-900 text-white py-4 font-body">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="logo-container">
          <Link to="/">
            <img src="img/logo-no-background.png" alt="Your Logo" className="h-8" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop and Mobile Navigation */}
        <nav className={`${isMobileMenuOpen ? 'absolute top-16 left-0 right-0 bg-blue-800 dark:bg-gray-900 shadow-lg z-50 py-4 px-4' : 'hidden'} md:flex md:items-center md:space-x-6 md:static md:shadow-none md:py-0 md:px-0`}>
          <ul className={`${isMobileMenuOpen ? 'flex flex-col space-y-4' : ''} md:flex md:space-x-6 md:space-y-0 md:flex-row`}>
            <li><Link to="/dashboard" className="hover:text-gray-300 block" onClick={() => setIsMobileMenuOpen(false)}>Programs</Link></li>
            <li><Link to="/experience" className="hover:text-gray-300 block" onClick={() => setIsMobileMenuOpen(false)}>Experience</Link></li>
            <li><Link to="/hbcu" className="hover:text-gray-300 block" onClick={() => setIsMobileMenuOpen(false)}>HBCU</Link></li>
            <li><Link to="/about" className="hover:text-gray-300 block" onClick={() => setIsMobileMenuOpen(false)}>About</Link></li>
            
            {/* Add Program Dropdown */}
            <li className="relative" ref={programDropdownRef}>
              <button 
                onClick={() => setIsProgramDropdownOpen(!isProgramDropdownOpen)}
                className="hover:text-gray-300 flex items-center"
              >
                Add Program
                <svg 
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${isProgramDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {isProgramDropdownOpen && (
                <div className={`${isMobileMenuOpen ? 'relative mt-2' : 'absolute left-0 mt-2'} w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50`}>
                  <Link 
                    to="/contribute" 
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setIsProgramDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Add New Program
                  </Link>
                  
                  {/* Add Resume Link */}
                  <Link 
                    to="/resume" 
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setIsProgramDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Upload Resume
                  </Link>
                  
                  {/* Public Resumes Link */}
                  <Link 
                    to="/public-resumes" 
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setIsProgramDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Browse Resumes
                  </Link>
                  
                  {/* Mentor Link */}
                  <Link 
                    to="/mentor" 
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setIsProgramDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Find Mentors
                  </Link>
                  
                  {user && (
                    <Link 
                      to="/my-contributions" 
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setIsProgramDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      My Contributions
                    </Link>
                  )}
                </div>
              )}
            </li>
          </ul>

          <div className={`${isMobileMenuOpen ? 'flex items-center justify-between mt-4 pt-4 border-t border-blue-700 dark:border-gray-700' : ''} md:flex md:items-center md:space-x-4 md:mt-0 md:pt-0 md:border-0`}>
            {/* Dark Mode Toggle with Animated Sun/Moon */}
            <button
              className="px-3 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <div className="relative w-6 h-6">
                {/* Sun Icon with Animation */}
                <div className={`absolute inset-0 transform transition-all duration-500 ${isDarkMode ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}>
                  <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* Moon Icon with Animation */}
                <div className={`absolute inset-0 transform transition-all duration-500 ${isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}`}>
                  <svg className="w-6 h-6 text-blue-100" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                </div>
              </div>
            </button>

            {/* Profile Icon & Dropdown - Only show when user is logged in */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
                  <img
                    src={user.photoURL || "/default-avatar.png"} // Profile pic or default
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                  />
                </button>

                {isDropdownOpen && (
                  <div className={`${isMobileMenuOpen ? 'relative mt-2' : 'absolute right-0 mt-2'} w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50`}>
                    {/* User Info */}
                    <div className="px-4 py-2 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold">{user.displayName || "User"}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    {/* Profile Link */}
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      View Profile
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Login button when user is not logged in */}
            {!user && (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
