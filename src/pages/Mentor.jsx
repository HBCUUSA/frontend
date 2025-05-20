import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const Mentor = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [universities, setUniversities] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        // This would be replaced with your actual API endpoint
        const response = await axios.get(`${baseURL}/api/mentors`);
        setMentors(response.data.mentors);
        
        // Extract unique universities for the filter
        const uniqueUniversities = [...new Set(response.data.mentors.map(mentor => mentor.university))];
        setUniversities(uniqueUniversities);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setError("Failed to load mentors. Please try again later.");
        
        // Fallback data for development/preview
        const fallbackMentors = [
          {
            id: 1,
            name: "Dr.Samuel E. Adunyah",
            university: "Meharry Medical College",
            field: "Biochemistry, Cancer Biology",
            imageUrl: "img/samuel-adunyah_1362-14.webp",
            rate: 45,
            available: true,
            rating: 4.8
          },
          {
            id: 2,
            name: "Student James Wilson",
            university: "Spelman College",
            field: "Business Administration",
            imageUrl: "img/20211203090156622_5.jpg",
            rate: 10,
            available: true,
            rating: 4.9
          },
          {
            id: 3,
            name: "Dr. Aisha Williams",
            university: "Morehouse College",
            field: "Engineering",
            imageUrl: "img/HBCU-2-scaled.webp",
            rate: 55,
            available: false,
            rating: 4.7
          },
          {
            id: 4,
            name: "Student Marcus Davis",
            university: "Florida A&M University",
            field: "Biology",
            imageUrl: "img/1671758941433.jpeg",
            rate: 40,
            available: true,
            rating: 4.6
          },
          {
            id: 5,
            name: "Dr. Keisha Thompson",
            university: "Clark Atlanta University",
            field: "Psychology",
            imageUrl: "img/uc-davis-biomedical-engineering-professor-laura-marcu.jpg",
            rate: 60,
            available: true,
            rating: 4.9
          },
          {
            id: 6,
            name: "Prof. Rudy Gostowski",
            university: "Fisk University",
            field: "Political Science",
            imageUrl: "img/1516283823701.jpeg",
            rate: 45,
            available: false,
            rating: 4.8
          }
        ];
        
        setMentors(fallbackMentors);
        const uniqueUniversities = [...new Set(fallbackMentors.map(mentor => mentor.university))];
        setUniversities(uniqueUniversities);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
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

  const filteredMentors = filter 
    ? mentors.filter(mentor => mentor.university === filter)
    : mentors;

  const handleBookMentor = (mentorId) => {
    // This would be replaced with your actual booking functionality
    alert(`Booking session with mentor ID: ${mentorId}`);
    // In a real app, this would navigate to a booking page or open a modal
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
          <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-950">
                  Find Your Mentor
                </h1>
                <p className="text-xl to-blue-950 max-w-2xl mx-auto">
                  Connect with experienced mentors from your target HBCU to get personalized guidance for your academic journey.
                </p>
              </div>

              {/* University Filter */}
              <div className="max-w-md mx-auto mb-8">
                <label htmlFor="university-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by University
                </label>
                <select
                  id="university-filter"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">All Universities</option>
                  {universities.map((uni, index) => (
                    <option key={index} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="relative w-24 h-24">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute top-2 left-2 w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin-slow"></div>
                  </div>
                </div>
              ) : error && mentors.length === 0 ? (
                <div className="bg-red-900 border border-red-400 text-red-200 p-6 rounded-lg max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
                  <p>{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 rounded-md transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredMentors.map((mentor) => (
                    <div key={mentor.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
                      <div className="relative">
                        <img 
                          src={mentor.imageUrl || '/img/default-mentor.jpg'} 
                          alt={mentor.name}
                          className="w-full h-64 object-cover"
                        />
                        {mentor.available ? (
                          <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Available
                          </span>
                        ) : (
                          <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Unavailable
                          </span>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
                        <p className="text-blue-600 font-semibold">{mentor.university}</p>
                        <p className="text-gray-600 mb-2">{mentor.field}</p>
                        
                        <div className="flex items-center mt-2 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-5 h-5 ${i < Math.floor(mentor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">{mentor.rating}/5.0</span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-lg font-bold text-gray-900">${mentor.rate}/hour</span>
                          <button 
                            onClick={() => handleBookMentor(mentor.id)}
                            disabled={!mentor.available}
                            className={`px-4 py-2 rounded-md ${
                              mentor.available 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Book Session
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Call to Action */}
              <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl shadow-md">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Become a Mentor</h2>
                <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                  Are you an HBCU alumni or faculty? Share your knowledge and experience by becoming a mentor for the next generation.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Apply to Mentor
                </button>
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

export default Mentor; 