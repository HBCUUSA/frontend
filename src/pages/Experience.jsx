import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

// Define fallback testimonial data
const MOCK_TESTIMONIALS = [
  {
    id: 'm1',
    title: 'My Internship at Google',
    programName: 'Tech Connect Program',
    thumbnailUrl: '/img/testimonial-1.jpg',
    videoUrl: 'https://example.com/videos/testimonial1.mp4',
  },
  {
    id: 'm2',
    title: 'How HBCUUSA Changed My Career Path',
    programName: 'Leadership Development',
    thumbnailUrl: '/img/testimonial-2.jpg',
    videoUrl: '/img/testimonial-video-2.mp4',
  },
  {
    id: 'm3',
    title: 'From Student to Full-Time Software Engineer',
    programName: 'Software Engineering Track',
    thumbnailUrl: '/img/testimonial-3.jpg',
    videoUrl: 'https://example.com/videos/testimonial3.mp4',
  }
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const carouselRef = useRef(null);

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

  // Navigate to the next slide
  const nextSlide = () => {
    if (!testimonials.length) return;
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Navigate to the previous slide
  const prevSlide = () => {
    if (!testimonials.length) return;
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
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
              className="text-center mb-16"
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
              <div className="relative mb-20" ref={carouselRef}>
                {/* Main Carousel */}
                <div className="relative w-full overflow-hidden rounded-xl shadow-lg bg-gray-900 aspect-video">
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={testimonial.id || index} 
                      className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                      {selectedVideo === testimonial.id ? (
                        <video 
                          src={testimonial.videoUrl} 
                          className="w-full h-full object-cover"
                          controls
                          autoPlay
                          onEnded={() => {
                            setSelectedVideo(null);
                            setIsPlaying(false);
                            // Auto advance to next slide after video ends
                            nextSlide();
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div 
                          className="relative w-full h-full cursor-pointer group"
                          onClick={() => handleVideoSelect(testimonial.id)}
                        >
                          <img 
                            src={testimonial.thumbnailUrl || `/img/default-testimonial-${index % 3 + 1}.jpg`} 
                            alt={testimonial.title || "Student Testimonial"}
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
                              <h3 className="text-xl font-semibold mb-1">{testimonial.title || "Student Experience"}</h3>
                              {testimonial.programName && (
                                <p className="text-blue-300 text-sm">{testimonial.programName}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Navigation Arrows */}
                  <button 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 z-20 text-white"
                    onClick={prevSlide}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 z-20 text-white"
                    onClick={nextSlide}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          index === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Thumbnails */}
                <div className="flex overflow-x-auto mt-4 gap-2 pb-2 px-2 no-scrollbar">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.id || index}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-md overflow-hidden transition-all ${
                        index === currentSlide ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    >
                      <img 
                        src={testimonial.thumbnailUrl || `/img/default-testimonial-${index % 3 + 1}.jpg`} 
                        alt={testimonial.title || "Thumbnail"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/img/default-thumbnail.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">No testimonials available at the moment.</p>
              </div>
            )}
            
            {/* Call to Action */}
            <div className="mt-16 text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Ready to start your journey?</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have found opportunities that match their interests and career goals.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/programs" className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Explore Programs
                </Link>
                <Link to="/apply" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Apply Now
                </Link>
              </div>
            </div>
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
