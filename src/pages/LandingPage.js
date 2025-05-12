import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img 
            src="/img/logo-no-background.png" 
            alt="HBCU Logo" 
            className="w-40 h-auto" 
          />
        </motion.div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link 
            to="/login" 
            className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
          >
            Log In
          </Link>
          <Link to="/signup">
            <button className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >
          {/* Main Heading */}
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Empowering the Next Generation of{" "}
            <span className="text-blue-600">HBCU Leaders</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join a community built on excellence, heritage, and innovation. 
            Discover opportunities tailored for HBCU students.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => navigate("/programs")}
              className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Programs
            </button>
            <Link to="/about">
              <button className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-full text-lg font-medium hover:bg-blue-50 transition-colors duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        </motion.div>
      </div>

      {/* Footer */}
     {/* Footer */}
<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
  &copy; 2025 HBCUUSA. All Rights Reserved.
</div>

    </div>
  );
};

export default LandingPage;
