import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ResumeFeedback from '../components/ResumeFeedback';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const ResumeFeedbackPage = () => {
  const { userId } = useParams();
  const { user, getAuthHeader, logout } = useAuth();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Fetch resume data when component mounts
  useEffect(() => {
    const fetchResumeData = async () => {
      if (!user || !userId) return;
      
      try {
        const response = await axios.get(
          `${baseURL}/api/resume/user/${userId}`,
          getAuthHeader()
        );
        
        setResumeData(response.data);
      } catch (err) {
        console.error('Error fetching resume data:', err);
        setError(err.response?.data?.message || 'Failed to load resume data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResumeData();
  }, [user, userId, getAuthHeader]);

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
            <div className="max-w-4xl mx-auto px-4">
              {!user ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Please log in to view and provide resume feedback
                  </p>
                  <Link 
                    to="/login" 
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Log In
                  </Link>
                </div>
              ) : (
                <>
                  {/* Header / Navigation */}
                  <div className="mb-6 flex items-center">
                    <Link 
                      to="/public-resumes" 
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                      </svg>
                      Back to Public Resumes
                    </Link>
                  </div>

                  {/* Main Content Area */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    {/* Resume Header Section - Reddit Style */}
                    <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {loading ? (
                            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                          ) : (
                            resumeData?.photoURL ? (
                              <img 
                                src={resumeData.photoURL} 
                                alt={resumeData.userName} 
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                                  {resumeData?.userName?.charAt(0).toUpperCase() || userId.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {loading ? (
                              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            ) : (
                              `${resumeData?.userName || 'User'}'s Resume`
                            )}
                          </h1>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>Posted by {resumeData?.userName || 'User'}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {loading ? (
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                              ) : (
                                resumeData?.resumeUpdatedAt ? 
                                  `Updated ${new Date(resumeData.resumeUpdatedAt?.toDate?.() || resumeData.resumeUpdatedAt).toLocaleDateString()}` : 
                                  'Recently'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resume Preview Section */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Resume Preview
                        </h2>
                        {!loading && resumeData?.resumeURL && (
                          <a 
                            href={resumeData.resumeURL}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Resume
                          </a>
                        )}
                      </div>
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        {loading ? (
                          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        ) : (
                          resumeData?.resumeURL && resumeData.resumeURL.includes('.pdf') ? (
                            <iframe
                              src={`${resumeData.resumeURL}#toolbar=0&navpanes=0`}
                              className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-md"
                              title="Resume Preview"
                            ></iframe>
                          ) : (
                            <div className="flex items-center justify-center h-64">
                              <p className="text-gray-500 dark:text-gray-400">
                                {resumeData?.resumeURL ? 'Resume preview not available' : 'No resume uploaded yet'}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* User Details Section */}
                    {!loading && resumeData && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-4">
                          {resumeData.college && (
                            <div className="flex items-center text-sm">
                              <svg className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300">{resumeData.college}</span>
                            </div>
                          )}
                          {resumeData.major && (
                            <div className="flex items-center text-sm">
                              <svg className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300">{resumeData.major}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Feedback Thread Section */}
                    <div className="p-6">
                      <ResumeFeedback userId={userId} />
                    </div>
                  </div>
                </>
              )}
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

export default ResumeFeedbackPage; 