import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
const baseURL = process.env.REACT_APP_BASE_URL
const Experience = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch testimonials from the API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/api/testimonials?limit=6`);
        setTestimonials(response.data.testimonials);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

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
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Student Stories
          </h1>
          <p className="text-xl text-blue-800 max-w-2xl mx-auto">
            Hear directly from students who have transformed their futures through our programs.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-2 left-2 w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin-slow"></div>
            </div>
          </div>
        ) : error ? (
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
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="relative aspect-square">
                    {selectedVideo === testimonial.id ? (
                      <video 
                        src={testimonial.videoUrl} 
                        className="w-full h-full object-cover"
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
                        className="relative w-full h-full cursor-pointer group"
                        onClick={() => handleVideoSelect(testimonial.id)}
                      >
                        <img 
                          src={testimonial.thumbnailUrl || '/img/default-thumbnail.jpg'} 
                          alt={testimonial.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300">
                          <div className="bg-white bg-opacity-90 rounded-full p-5 transform transition-transform duration-300 group-hover:scale-110 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-white">{testimonial.title}</h3>
                    {testimonial.programName && (
                      <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                        {testimonial.programName}
                      </div>
                    )}
                    <div className="mt-2 flex items-center">
                      <img 
                        src={testimonial.studentImage || '/img/default-avatar.jpg'} 
                        alt={testimonial.studentName || 'Student'} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                      />
                      <div className="ml-2">
                        <p className="font-medium text-white text-sm">{testimonial.studentName || 'HBCU Student'}</p>
                        <p className="text-xs text-blue-200">{testimonial.university || 'HBCU University'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start your journey?</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link to="/programs" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Explore Programs
            </Link>
            <Link to="/apply" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Apply Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Experience;
