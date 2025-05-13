import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();
  const googleButtonRef = useRef(null);
  const [googleButtonVisible, setGoogleButtonVisible] = useState(false);

  // Initialize Google Sign-In button
  useEffect(() => {
    // Set a timeout to ensure the DOM is fully loaded
    const timer = setTimeout(() => {
      if (window.google && googleButtonRef.current) {
        try {
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            { 
              theme: 'outline',
              size: 'large', 
              type: 'standard',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'center',
              width: googleButtonRef.current.clientWidth || 300
            }
          );
          setGoogleButtonVisible(true);
        } catch (error) {
          console.error("Error rendering Google Sign-In button:", error);
          setGoogleButtonVisible(false);
        }
      } else {
        console.log("Google Identity Services not available for rendering button");
        setGoogleButtonVisible(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [googleButtonRef.current]);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        // Redirect to prrograms page after successful login
        navigate('/programs');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    
    setLoading(true);
    setError("");
    
    try {
      await signInWithGoogle();
      // The callback will handle redirect to dashboard
      // We'll set a timeout to reset loading state if the callback doesn't trigger
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to initiate Google sign in. Please try again.");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800">
      <main className="flex-1 flex justify-center items-center py-8 px-4">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full transition-all duration-300 hover:shadow-xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Welcome Back</h1>
          
          <form id="login-form" className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FiMail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  onChange={handleChange}
                  value={data.email}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FiLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={data.password}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                />
                <div 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </div>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800 transition-all duration-300">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400"></span>
            </div>
          </div>

          {/* Google Sign In Button - Official */}
          <div 
            ref={googleButtonRef}
            className={`w-full ${googleButtonVisible ? 'block' : 'hidden'} my-4`}
          ></div>
          

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              New here?
            </p>
            <Link to="/signup">
              <button type="button" className="mt-1 w-full py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
