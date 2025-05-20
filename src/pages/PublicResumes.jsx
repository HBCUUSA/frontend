import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const PublicResumes = () => {
  const { user, getAuthHeader, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [colleges, setColleges] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Fetch public resumes when component mounts
  useEffect(() => {
    const fetchPublicResumes = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `${baseURL}/api/resume/public`,
          getAuthHeader()
        );
        
        setResumes(response.data);
        
        // Extract unique colleges for filtering
        const uniqueColleges = [...new Set(response.data.map(resume => resume.college))];
        setColleges(uniqueColleges.sort());
      } catch (err) {
        console.error('Error fetching public resumes:', err);
        setError(err.response?.data?.message || 'Failed to load public resumes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublicResumes();
  }, [user, getAuthHeader]);

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

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Filter resumes based on search term and college filter
  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = searchTerm === '' || 
      resume.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCollege = collegeFilter === '' || 
      resume.college === collegeFilter;
    
    return matchesSearch && matchesCollege;
  });

  return (
    <div className="relative min-h-screen bg-white flex">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-70"></div>
      
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        sidebarRef={sidebarRef}
        user={user}
      />
      
      {/* Main Content */}
      <div className="relative z-10 flex-1">
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
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
            <div className="max-w-6xl mx-auto px-4">
              <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
                Public Resumes
              </h1>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Browse resumes shared by other users. You can provide feedback to help them improve.
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search by name
                    </label>
                    <input
                      type="text"
                      id="search"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="college" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filter by college
                    </label>
                    <select
                      id="college"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      value={collegeFilter}
                      onChange={(e) => setCollegeFilter(e.target.value)}
                    >
                      <option value="">All Colleges</option>
                      {colleges.map((college) => (
                        <option key={college} value={college}>
                          {college}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                ) : filteredResumes.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No resumes found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {searchTerm || collegeFilter ? 'Try adjusting your filters' : 'No public resumes available yet'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResumes.map((resume) => (
                      <div key={resume.userId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                          {resume.photoURL ? (
                            <img 
                              src={resume.photoURL} 
                              alt={resume.userName} 
                              className="h-12 w-12 rounded-full mr-4"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-4">
                              <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                                {resume.userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              {resume.userName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {resume.college}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                          Last updated: {new Date(resume.resumeUpdatedAt?.toDate?.() || resume.resumeUpdatedAt).toLocaleDateString()}
                        </p>
                        
                        <Link
                          to={`/resume-feedback/${resume.userId}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View & Provide Feedback
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>

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

export default PublicResumes; 