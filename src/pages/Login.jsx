import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
// import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';


const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showMagicLinkForm, setShowMagicLinkForm] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [verifyingMagicLink, setVerifyingMagicLink] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithGoogle, resetPassword, sendSignInLink, isSignInLink, verifyMagicLink, resendVerificationEmail } = useAuth();
  const googleButtonRef = useRef(null);
  const [googleButtonVisible, setGoogleButtonVisible] = useState(false);
  const baseURL = process.env.REACT_APP_BASE_URL;
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const checkForMagicLink = async () => {
      if (isSignInLink(window.location.href)) {
        setVerifyingMagicLink(true);
        setLoading(true);
        
        let email = window.localStorage.getItem('emailForSignIn');
        
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        
        if (!email) {
          setError('Email is required to complete sign-in.');
          setLoading(false);
          setVerifyingMagicLink(false);
          return;
        }
        
        try {
          const result = await verifyMagicLink(email, window.location.href);
          
          if (result.success) {
            localStorage.removeItem('emailForSignIn');
            
            setSuccess('You have been successfully signed in!');
            setTimeout(() => {
              navigate('/programs');
            }, 1500);
          } else {
            setError(result.message || 'Failed to verify the magic link.');
          }
        } catch (error) {
          console.error('Magic link verification error:', error);
          setError('Failed to verify the magic link. It may have expired or is invalid.');
        } finally {
          setLoading(false);
          setVerifyingMagicLink(false);
          
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    
    checkForMagicLink();
  }, [navigate, isSignInLink, verifyMagicLink]);

  // Initialize Google Sign-In button
  useEffect(() => {
    if (showResetForm || showMagicLinkForm || verifyingMagicLink) return;
    
    if (window.google && googleButtonRef.current) {
      try {
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: 'outline', size: 'large', width: googleButtonRef.current.clientWidth, text: 'signin_with' }
        );
        setGoogleButtonVisible(true);
      } catch (error) {
        console.error("Error rendering Google Sign-In button:", error);
        setGoogleButtonVisible(false);
      }
    }
  }, [googleButtonRef, showResetForm, showMagicLinkForm, verifyingMagicLink]);

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
    setLoading(true);
    setError("");
    setNeedsVerification(false);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        navigate('/programs');
      } else {
        if (result.message?.includes('verify your email') || result.code === 'auth/email-not-verified') {
          setNeedsVerification(true);
          setUnverifiedEmail(data.email);
          setError(result.message);
        } else {
          setError(result.message);
        }
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
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to initiate Google sign in. Please try again.");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail || !resetEmail.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await resetPassword(resetEmail);
      setSuccess("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setShowResetForm(false);
        setSuccess("");
        setResetEmail("");
      }, 5000);
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.code === 'auth/user-not-found') {
        setError("No account found with this email address.");
      } else if (error.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send password reset email. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    
    if (!magicLinkEmail || !magicLinkEmail.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const redirectUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
      
      await sendSignInLink(magicLinkEmail, redirectUrl);
      
      window.localStorage.setItem('emailForSignIn', magicLinkEmail);
      
      setSuccess("Magic link sent! Check your email to sign in.");
      setTimeout(() => {
        setShowMagicLinkForm(false);
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error('Magic link error:', error);
      setError("Failed to send magic link. Please check your email address.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) {
      setError("Email address is missing. Please enter your email and try again.");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const result = await resendVerificationEmail(unverifiedEmail);
      if (result.success) {
        setSuccess(result.message || "Verification email has been resent. Please check your inbox.");
      } else {
        setError(result.message || "Failed to resend verification email.");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setError("Failed to resend verification email. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative min-h-screen bg-white flex">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-70"></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex-1">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 w-full">
          <div className="container mx-auto px-4 py-3 md:px-6 md:py-4 flex justify-between items-center">
            <div className="flex items-center">              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="pl-0 md:pl-2"
              >
                <Link to="/">
                  <img 
                    src="/img/logo-no-background.png" 
                    alt="HBCU Logo" 
                    className="w-32 md:w-40 h-auto"
                  />
                </Link>
              </motion.div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-6">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base">
                Log In
              </Link>
              <Link to="/signup">
                <button className="px-4 py-1.5 md:px-6 md:py-2 bg-black text-white rounded-full text-xs md:text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex justify-center items-center py-6 md:py-8 px-4">
          <div className="bg-white dark:bg-gray-900 p-5 md:p-8 rounded-lg shadow-lg max-w-md w-full transition-all duration-300 hover:shadow-xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-gray-800 dark:text-white">Welcome Back</h1>
            
            {success && (
              <div className="p-3 mb-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm border border-green-200 dark:border-green-800 transition-all duration-300">
                {success}
              </div>
            )}

            {verifyingMagicLink ? (
              <div className="space-y-6 text-center">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4">Verifying Magic Link</h2>
                <div className="flex flex-col items-center justify-center py-6">
                  <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Verifying your sign-in link...
                  </p>
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800 transition-all duration-300">
                    {error}
                  </div>
                )}
              </div>
            ) : showResetForm ? (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4">Reset Your Password</h2>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiMail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800 transition-all duration-300">
                    {error}
                  </div>
                )}
                
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetForm(false);
                      setError("");
                      setResetEmail("");
                    }}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : showMagicLinkForm ? (
              <form className="space-y-6" onSubmit={handleMagicLink}>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4">Passwordless Sign In</h2>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiMail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={magicLinkEmail}
                    onChange={(e) => setMagicLinkEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800 transition-all duration-300">
                    {error}
                  </div>
                )}
                
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : 'Send Magic Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMagicLinkForm(false);
                      setError("");
                      setMagicLinkEmail("");
                    }}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : needsVerification ? (
              <div className="space-y-6">
                <div className="p-3 mb-4 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm border border-amber-200 dark:border-amber-800">
                  {error}
                </div>
                
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={handleResendVerification}
                    disabled={loading}
                    className={`w-full bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                  
                  <button
                    onClick={() => setNeedsVerification(false)}
                    className="w-full bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-300 py-2 px-4 rounded-md border border-blue-500 dark:border-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <>
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
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetForm(true);
                        setError("");
                        setResetEmail(data.email || "");
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
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

                {/* Google Sign In Button */}
                <div 
                  ref={googleButtonRef}
                  className="w-full flex justify-center my-4"
                >
                  {/* Custom Google button fallback */}
                  <button
                    onClick={handleGoogleSignIn}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
                  </button>
                </div>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowMagicLinkForm(true);
                    setError("");
                    setMagicLinkEmail(data.email || "");
                  }}
                  className="w-full mt-4 py-3 px-4 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200 flex items-center justify-center"
                >
                  <FiMail className="mr-2" size={18} />
                  Sign in with Magic Link
                </button>

                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm md:text-base">
                    New here?
                  </p>
                  <Link to="/signup">
                    <button type="button" className="mt-1 w-full py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
                      Create Account
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
