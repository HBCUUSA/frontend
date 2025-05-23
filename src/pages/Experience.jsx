import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

// // Define fallback testimonial data
const MOCK_TESTIMONIALS = [
//   // {
//   //   id: 'm1',
//   //   title: 'How HBCUUSA Changed My Career Path',
//   //   programName: 'The Pitch Competition',
//   //   thumbnailUrl: '/img/testimonial-1.jpg',
//   //   videoUrl: 'https://example.com/videos/testimonial1.mp4',
//   // }
//   /* Commented out for now
//   {
//     id: 'm2',
//     title: 'How HBCUUSA Changed My Career Path',
//     programName: 'Leadership Development',
//     thumbnailUrl: '/img/testimonial-2.jpg',
//     videoUrl: '/img/testimonial-video-2.mp4',
//   },
//   {
//     id: 'm3',
//     title: 'From Student to Full-Time Software Engineer',
//     programName: 'Software Engineering Track',
//     thumbnailUrl: '/img/testimonial-3.jpg',
//     videoUrl: 'https://example.com/videos/testimonial3.mp4',
//   }
//   */
];

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const Experience = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Fetch testimonials from the API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/api/testimonials?limit=6`);
        
        // Check if response has data and testimonials
        if (response.data && response.data.testimonials && response.data.testimonials.length > 0) {
          setTestimonials(response.data.testimonials);
        } else {
          // Use mock data if no testimonials are available from API
          console.log('No testimonials returned from API, using mock data.');
          setTestimonials(MOCK_TESTIMONIALS);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials. Using sample stories instead.");
        // Use mock data on error
        setTestimonials(MOCK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
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

  // Handle video selection
  const handleVideoSelect = (id) => {
    // If a video is already playing, stop it first
    if (selectedVideo) {
      setSelectedVideo(null);
      setIsPlaying(false);
      // Small delay to ensure the previous video stops before starting a new one
      setTimeout(() => {
        setSelectedVideo(id);
        setIsPlaying(true);
      }, 100);
    } else {
      setSelectedVideo(id);
      setIsPlaying(true);
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
        {/* Header - Using Navbar Component */}
        <Navbar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        {/* Page Content */}
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <main className="max-w-6xl mx-auto px-6 py-16">
            {/* Page Title */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Student Stories
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hear directly from students who have transformed their futures through our programs.
              </p>
            </motion.div>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Oops! Something went wrong</h3>
                <p className="mt-1 text-gray-500">{error}</p>
                <div className="mt-6">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : testimonials && testimonials.length > 0 ? (
              <div className="max-w-4xl mx-auto mb-16">
                {/* Single Testimonial Video */}
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-900">
                  {selectedVideo === testimonials[0].id ? (
                    <video 
                      src={testimonials[0].videoUrl} 
                      className="w-full aspect-video object-contain"
                      controls
                      autoPlay
                      onEnded={() => {
                        setSelectedVideo(null);
                        setIsPlaying(false);
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div 
                      className="relative w-full aspect-video cursor-pointer group"
                      onClick={() => handleVideoSelect(testimonials[0].id)}
                    >
                      <img 
                        src={testimonials[0].thumbnailUrl || '/img/default-testimonial-1.jpg'} 
                        alt={testimonials[0].title || "Student Testimonial"}
                        className="w-full h-full object-cover brightness-75"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/img/default-thumbnail.jpg';
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-5 mb-6 transform transition-transform duration-300 group-hover:scale-110 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <div className="text-white text-center px-4 py-2 bg-black bg-opacity-50 rounded-lg backdrop-blur-sm max-w-md">
                          <h3 className="text-xl font-semibold mb-1">{testimonials[0].title || "Student Experience"}</h3>
                          {testimonials[0].programName && (
                            <p className="text-blue-300 text-sm">{testimonials[0].programName}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Video Description */}
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{testimonials[0].title || "Student Experience"}</h3>
                  <p className="text-gray-600">
                    Watch this inspiring story from one of our students who participated in one of the program through {testimonials[0].programName || "HBCUUSA"}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">No testimonials available at the moment.</p>
              </div>
            )}
          </main>
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

export default Experience;
