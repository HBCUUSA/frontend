import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
  const navigate = useNavigate();
  const { signup, signInWithGoogle } = useAuth();
  const googleButtonRef = useRef(null);

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
        setSuccessMessage("Signup successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
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

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 flex justify-center items-center bg-gray-100 dark:bg-gray-800 font-body">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md max-w-md w-full">
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
        </div>
      </main>
    </div>
  );
};

export default Signup;
