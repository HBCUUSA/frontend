import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const Mentor = () => {
  const { user } = useAuth();
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
    const loadMentors = () => {
      try {
        setLoading(true);
        
        // Set mentors from the mentors folder
        const mentorsList = [
          {
            id: 1,
            name: "Michael Ewing",
            university: "Fisk University",
            field: "Art Curator, Frist Art Museum",
            imageUrl: "/img/mentors/AAN_michael-ewing_full.webp",
            email: "mewing@fristartmuseum.org",
            available: true,
          },
          {
            id: 2,
            name: "Evelina Naish",
            university: "Meharry Medical College",
            field: "Business Administration",
            imageUrl: "/img/mentors/Evelina Naish.jpeg",
            email: "evelina.naish@mmc.edu",
            available: true,
          },
          {
            id: 3,
            name: "Latane Brackett",
            university: "Jackson State University",
            field: "Business Administration, Electronics Engineering",
            imageUrl: "/img/mentors/latane-brackett.jpeg",
            email: "latane.e.brackett_iii@jsums.edu",
            available: true,
          }
        ];
        
        setMentors(mentorsList);
        
        // Extract unique universities for the filter
        const uniqueUniversities = [...new Set(mentorsList.map(mentor => mentor.university))];
        setUniversities(uniqueUniversities);
      } catch (err) {
        console.error("Error loading mentors:", err);
        setError("Failed to load mentors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadMentors();
  }, []);

  const filteredMentors = filter 
    ? mentors.filter(mentor => mentor.university === filter)
    : mentors;

  const handleEmailMentor = (email) => {
    // Open email client with prefilled email
    window.location.href = `mailto:${email}?subject=Mentorship%20Request&body=Hello,%0A%0AI'm interested in connecting with you for mentorship. I found your profile on HBCUUSA and would like to schedule some time to talk.%0A%0AThank you,%0A[Your Name]`;
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
        {/* Header - Using Navbar Component */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
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
                          <span className="text-sm text-gray-500">{mentor.email}</span>
                          <button 
                            onClick={() => handleEmailMentor(mentor.email)}
                            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                          >
                            Email Mentor
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
                  Are you an HBCU alumni or faculty? Share your knowledge and experience by becoming a mentor for the next generation of students.
                </p>
                <Link to="/mentor-signup">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                    Apply to Mentor
                  </button>
                </Link>
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