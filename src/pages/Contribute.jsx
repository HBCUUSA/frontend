import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const Contribute = () => {
  const { user, getAuthHeader, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", website: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setLoginPrompt(true);
      setError("Please log in to contribute");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Submit contribution via API
      await axios.post(`${baseURL}/api/contributions`,
        {
          name: data.name,
          website: data.website,
          description: data.description
        },
        getAuthHeader()
      );
      
      setSuccess("Thank you for your contribution! It will be reviewed shortly.");
      
      // Clear form after successful submission
      setData({ name: "", website: "", description: "" });
    } catch (error) {
      console.error("Error submitting contribution:", error);
      setError(error.response?.data?.message || "Failed to submit contribution. Please try again.");
    } finally {
      setLoading(false);
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
          <main className="flex-1 p-8 font-body">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md mb-8">
                <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Contribute by adding a program</h1>
                
                {loginPrompt && !user && (
                  <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-800 dark:text-yellow-200 rounded">
                    <p>You need to be logged in to contribute.</p>
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                      Go to Login
                    </Link>
                  </div>
                )}
                
                {user && (
                  <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-800 dark:text-blue-200 rounded">
                    <p>Want to see your previous contributions?</p>
                    <Link to="/my-contributions" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                      View My Contributions
                    </Link>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block mb-1 dark:text-gray-300">Program Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Fellowship or program name..."
                      onChange={handleChange}
                      value={data.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block mb-1 dark:text-gray-300">Program Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      placeholder="Website URL (e.g., https://example.com)..."
                      onChange={handleChange}
                      value={data.website}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block mb-1 dark:text-gray-300">Program Description</label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe the program, eligibility requirements, application process, etc..."
                      onChange={handleChange}
                      value={data.description}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                      style={{ height: '200px' }}
                      required
                    ></textarea>
                  </div>
                  {error && <div className="text-red-500">{error}</div>}
                  {success && <div className="text-green-500">{success}</div>}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Submitting...' : 'Submit Contribution'}
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        {/* <Footer /> */}
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

export default Contribute;
