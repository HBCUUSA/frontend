import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Signup = () => {
  const [data, setData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    college: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { signup, signInWithGoogle, resendVerificationEmail, logout } = useAuth();
  const googleButtonRef = useRef(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Initialize Google Sign-In button
  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      try {
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: 'outline', size: 'large', width: googleButtonRef.current.clientWidth, text: 'signup_with' }
        );
      } catch (error) {
        console.error("Error rendering Google Sign-In button:", error);
      }
    }
  }, [googleButtonRef]);

  // Add click outside listener for profile dropdown
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

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Call the signup function from AuthContext
      const result = await signup(data.email, data.password, data.name, data.college);
      
      if (result.success) {
        setVerificationSent(true);
        setVerificationEmail(data.email);
        setSuccessMessage(result.message);
        
        // Reset form data
        setData({ 
          name: "", 
          email: "", 
          password: "",
          college: ""
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verificationEmail) {
      setError("Email address is missing. Please try signing up again.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const result = await resendVerificationEmail(verificationEmail);
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await signInWithGoogle();
      // The callback will handle redirect to dashboard
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to initiate Google sign in. Please try again.");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        user={null}
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
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Log In
              </Link>
              <Link to="/signup">
                <button className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 flex justify-center items-center py-8 px-4">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md max-w-md w-full">
            {verificationSent ? (
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
                <div className="mb-6 text-gray-600 dark:text-gray-300">
                  <p>We've sent a verification link to <strong>{verificationEmail}</strong>.</p>
                  <p className="mt-2">Please check your inbox and click the link to verify your email address.</p>
                </div>
                
                {successMessage && (
                  <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm mb-4">
                    {successMessage}
                  </div>
                )}
                
                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-4">
                    {error}
                  </div>
                )}
                
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className={`w-full bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                  
                  <Link to="/login">
                    <button
                      className="w-full bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-300 py-2 px-4 rounded-md border border-blue-500 dark:border-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Back to Login
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up for More Opportunities</h1>
                <form id="signup" className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    onChange={handleChange}
                    value={data.name}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="email"
                    placeholder="HBCU Email"
                    name="email"
                    onChange={handleChange}
                    value={data.email}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="College/University (Optional)"
                    name="college"
                    onChange={handleChange}
                    value={data.college}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                      value={data.password}
                      required
                      minLength="6"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {showPassword ? (
                        <FiEyeOff onClick={togglePasswordVisibility} className="text-gray-400 cursor-pointer" />
                      ) : (
                        <FiEye onClick={togglePasswordVisibility} className="text-gray-400 cursor-pointer" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 6 characters long
                  </p>
                  
                  {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  {successMessage && (
                    <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
                      {successMessage}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400"></span>
                  </div>
                </div>

                {/* Google Sign In Button */}
                <div 
                  ref={googleButtonRef}
                  className="w-full flex justify-center my-4"
                ></div>

                <div className="mt-4 text-center">
                  <h1 className="text-lg">Already have an account?</h1>
                  <Link to="/login">
                    <button
                      type="button"
                      className="mt-2 w-full bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-300 py-2 px-4 rounded-md border border-blue-500 dark:border-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Login Here
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </main>
        
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

export default Signup;
