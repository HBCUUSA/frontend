import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const FilterDropdown = ({ filters, onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFilterCount = Object.values(filters).filter(value => value !== "").length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
              {activeFilterCount}
            </span>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg z-10 p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Filter Programs</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Month</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={filters.month}
                onChange={(e) => onApplyFilters("month", e.target.value)}
              >
                <option value="">All Months</option>
                {["January", "February", "March", "April", "May", "June", "July", 
                  "August", "September", "October", "November", "December"].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={filters.university}
                onChange={(e) => onApplyFilters("university", e.target.value)}
              >
                <option value="">All Universities</option>
                {["Howard University", "Spelman College", "Morehouse College", 
                  "Fisk University", "Hampton University"].map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={filters.citizenship}
                onChange={(e) => onApplyFilters("citizenship", e.target.value)}
              >
                <option value="">All Citizenship Types</option>
                <option value="US Citizen">US Citizen</option>
                <option value="International">International</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={filters.programType}
                onChange={(e) => onApplyFilters("programType", e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Fellowship">Fellowship</option>
                <option value="Internship">Internship</option>
                <option value="Initiative">Initiative</option>
                <option value="Conference">Conference</option>
                <option value="Program">Program</option>
              </select>
            </div>
          </div>
          
          <div className="mt-5 flex justify-between">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => {
                onApplyFilters("reset");
                setIsOpen(false);
              }}
            >
              Reset All
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Programs = () => {
  const { user, logout } = useAuth(); // Get current user info and logout function
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    month: "",
    university: "",
    programType: "",
    citizenship: ""
  });
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // For user profile dropdown
  const [showScrollTop, setShowScrollTop] = useState(false); // For scroll to top button
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Handle scroll to collapse sidebar and show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      }
      
      // Show scroll-to-top button when scrolled down 300px
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSidebarCollapsed]);

  // Close profile dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

  // Update the useEffect for fetching programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        // Use the actual program.json file in your public directory
        const response = await fetch(`${process.env.PUBLIC_URL}/img/program.json`);
        if (!response.ok) throw new Error('Failed to fetch programs');
        const data = await response.json();
        
        // Process the data to handle potential missing fields
        const processedData = data.map(program => ({
          ...program,
          // Extract month from the deadline if applicationMonth isn't provided
          applicationMonth: program.applicationMonth || (program.applicationDeadline ? 
            new Date(program.applicationDeadline).toLocaleString('en-US', { month: 'long' }) : null),
          // Ensure description has a value if empty
          description: program.description || "No description available",
          // Set default type if not provided
          programType: program.programType || "Scholarship",
          // Set default university and citizenship
          university: program.university || "",
          citizenship: program.citizenship || ""
        }));
        
        setPrograms(processedData);
        setFilteredPrograms(processedData);
      } catch (err) {
        console.error('Error fetching programs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Apply filters and search whenever they change
  useEffect(() => {
    if (programs.length > 0) {
      setFilteredPrograms(programs.filter((program) => 
        (searchTerm === "" || program.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filters.month === "" || program.applicationMonth === filters.month) &&
        (filters.university === "" || program.university === filters.university) &&
        (filters.programType === "" || program.programType === filters.programType) &&
        (filters.citizenship === "" || program.citizenship === filters.citizenship)
      ));
    }
  }, [searchTerm, filters, programs]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "reset") {
      setFilters({
        month: "",
        university: "",
        programType: "",
        citizenship: ""
      });
    } else {
      setFilters({
        ...filters,
        [filterType]: value
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-70"></div>
      
      {/* Sidebar - Desktop (collapsible) & Mobile (toggleable) */}
      <aside 
        ref={sidebarRef}
        className={`fixed lg:sticky top-0 z-40 h-auto bg-white shadow-lg transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Collapse toggle button (only visible on desktop) */}
        <button
          className="hidden lg:flex absolute -right-3 top-20 bg-white h-6 w-6 rounded-full shadow-md cursor-pointer z-20 items-center justify-center"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg className="w-4 h-4 text-gray-500" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isSidebarCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
        {/* TODO: Create a separate component for the sidebar and import this component to other pages */}
        <div className={`p-6 ${isSidebarCollapsed ? 'px-4' : ''}`}>
          {/* <Link to="/">
            <img 
              src="/img/logo-no-background.png" 
              alt="HBCU Logo" 
              className={`${isSidebarCollapsed ? 'w-12' : 'w-40'} h-auto mx-auto mb-8 transition-all duration-300`}
            />
          </Link> */}
          
          <nav className="">
            <div className="space-y-2">
              <Link to="/programs" 
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
                ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title="Programs"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                {!isSidebarCollapsed && <span className="ml-3">Programs</span>}
              </Link>
              
              <Link to="/experience" 
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
                ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title="Experience"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                {!isSidebarCollapsed && <span className="ml-3">Experience</span>}
              </Link>
              
              <Link to="/hbcu" 
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
                ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title="HBCU"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                {!isSidebarCollapsed && <span className="ml-3">HBCU</span>}
              </Link>
              
              <Link to="/about" 
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
                ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title="About"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {!isSidebarCollapsed && <span className="ml-3">About</span>}
              </Link>
              
              {!isSidebarCollapsed && (
                <div className="py-2">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Add Programs</p>
                </div>
              )}
              
              {isSidebarCollapsed && (
                <div className="py-2 flex justify-center">
                  <div className="w-8 border-t border-gray-200"></div>
                </div>
              )}
              
              <Link to="/contribute" 
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
                ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title="Add New Program"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {!isSidebarCollapsed && <span className="ml-3">Add New Program</span>}
              </Link>
              
              <Link to="/resume" 
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
                ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title="Upload Resume"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {!isSidebarCollapsed && <span className="ml-3">Upload Resume</span>}
              </Link>
              
              <Link to="/public-resumes" 
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
                ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title="Browse Resumes"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
                </svg>
                {!isSidebarCollapsed && <span className="ml-3">Browse Resumes</span>}
              </Link>
              
              <Link to="/mentor" 
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
                ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title="Find Mentors"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {!isSidebarCollapsed && <span className="ml-3">Find Mentors</span>}
              </Link>
              
              {user && (
                <Link to="/my-contributions" 
                  className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
                  ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="My Contributions"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  {!isSidebarCollapsed && <span className="ml-3">My Contributions</span>}
                </Link>
              )}
            </div>
          </nav>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className={`relative z-10 flex-1`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 w-full">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              {/* Sidebar toggle for mobile */}
              <button
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isSidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="pl-2"
              >
                <Link to="/">
                  <img 
                    src="/img/logo-no-background.png" 
                    alt="HBCU Logo" 
                    className="w-40 h-auto"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {/* Show user profile when logged in */}
              {user ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} 
                    className="focus:outline-none"
                  >
                    <img
                      src={user.photoURL || "/default-avatar.png"} // Profile pic or default
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-gray-300"
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-2 text-gray-900 border-b border-gray-200">
                        <p className="font-semibold">{user.displayName || "User"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>

                      {/* Profile Link */}
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        View Profile
                      </Link>

                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Log In
                  </Link>
                  <Link to="/signup">
                    <button className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-6xl mx-auto px-6 py-16">
          {/* Page Title */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Explore Our Programs
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find opportunities that align with your interests and career goals.
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div 
            className="max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex gap-4 bg-white p-2 rounded-full shadow-sm border border-gray-100">
              <div className="flex items-center pl-4 flex-grow">
                <svg className="w-5 h-5 text-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search programs..."
                  className="flex-1 py-2 focus:outline-none text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <FilterDropdown filters={filters} onApplyFilters={handleFilterChange} />
            </div>

            {/* Active Filters */}
            {Object.values(filters).some(value => value !== "") && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => 
                  value && (
                    <motion.span 
                      key={key} 
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-100 flex items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {value}
                      <button 
                        className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                        onClick={() => handleFilterChange(key, "")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.span>
                  )
                )}
                <button 
                  className="text-blue-600 text-sm underline underline-offset-2 hover:text-blue-800"
                  onClick={() => handleFilterChange("reset")}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>

          {/* Programs Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredPrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-6 flex flex-col h-full">
                    {program.logo && (
                      <div className="flex justify-center mb-6">
                        <img
                          src={program.logo}
                          alt={program.name}
                          className="h-14 object-contain"
                        />
                      </div>
                    )}
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                      {program.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-6 text-center flex-grow">
                      {program.description || "No description available"}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {program.applicationMonth && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Opens</span>
                          <span className="font-medium text-gray-800">{program.applicationMonth}</span>
                        </div>
                      )}
                      {program.applicationDeadline && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Deadline</span>
                          <span className="font-medium text-gray-800">
                            {new Date(program.applicationDeadline).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                      {program.programType && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Program Type</span>
                          <span className="font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">
                            {program.programType}
                          </span>
                        </div>
                      )}
                      {program.university && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">University</span>
                          <span className="font-medium text-gray-800">{program.university}</span>
                        </div>
                      )}
                    </div>
                    
                    <a
                      href={program.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full mt-auto"
                    >
                      <button className="w-full px-5 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        Apply Now
                      </button>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No programs found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    handleFilterChange("reset");
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              &copy; 2025 HBCUUSA. All Rights Reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed right-8 bottom-8 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Programs;
         