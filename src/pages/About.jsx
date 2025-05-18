import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function About() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    // Add viewport meta tag dynamically for mobile optimization
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    document.head.appendChild(metaViewport);

    return () => {
      // Check if the element still exists before trying to remove it
      if (document.head.contains(metaViewport)) {
        document.head.removeChild(metaViewport);
      }
    };
  }, []);

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
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <main className="bg-gray-100 dark:bg-gray-800 font-body">
            {/* Image Section - Full size, responsive */}
            <section className="max-w-6xl mx-auto">
              <div className="w-full h-[400px] md:h-[500px] overflow-hidden">
                <img
                  src="img/9404239828_0443447145_o.jpg"
                  alt="HBCU Campus"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </section>

            {/* Welcome Section */}
            <section className="bg-white dark:bg-gray-900 py-8 sm:py-12">
              <div className="max-w-6xl mx-auto px-4 sm:px-8">
                {/* Welcome Content */}
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white text-center sm:text-left">
                  Welcome to HBCUUSA: A HBCU & MSI Initiative
                </h2>
                <div className="space-y-4 max-w-4xl">
                  <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                    Do you want to take advantage of opportunities and gain industry experience during college? 
                    Do you see your friends' posts about scholarships and wonder where they applied from?
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                    HBCUUSA is a community for HBCU and MSI students to find internships, fellowships, and CSR programs. 
                    We connect students with Corporate Social Responsibility (CSR) initiatives and fellowships designed 
                    to promote diversity, inclusion, and social impact.
                  </p>
                </div>
              </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="bg-white dark:bg-gray-900 py-4 sm:py-6">
              <div className="max-w-6xl mx-auto px-4 sm:px-8">
                <div className="max-w-4xl">
                  {/* Mission Section */}
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white text-center sm:text-left">
                    Our Mission
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-10">
                    Our mission is to <strong>empower HBCU and MSI students</strong> with resources, opportunities, 
                    and information about CSR initiatives that support their personal and professional development.
                  </p>

                  {/* Vision Section */}
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white text-center sm:text-left">
                    Our Vision
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                    We envision a future where <strong>every student</strong>, regardless of background, has equal access 
                    to growth opportunities and can make a <strong>positive impact</strong> in their communities.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>

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

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
