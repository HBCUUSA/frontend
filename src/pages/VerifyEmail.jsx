import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verifyEmailWithOobCode = async () => {
      try {
        // Extract the oobCode from URL
        const queryParams = new URLSearchParams(location.search);
        const oobCode = queryParams.get('oobCode');
        
        if (!oobCode) {
          setStatus('error');
          setMessage('Invalid verification link. No verification code found.');
          return;
        }

        // Call the verifyEmail function from AuthContext
        const result = await verifyEmail(oobCode);
        
        if (result.success) {
          setStatus('success');
          setMessage(result.message || 'Your email has been verified successfully!');
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.message || 'Failed to verify your email.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('An error occurred during verification. The link might be invalid or expired.');
      }
    };

    verifyEmailWithOobCode();
  }, [location.search, navigate, verifyEmail]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex justify-center items-center font-body">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Email Verification</h1>
        
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-6">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying your email...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="rounded-full bg-green-100 p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-700 dark:text-green-300 mb-4">{message}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Redirecting to login page...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <div className="rounded-full bg-red-100 p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-700 dark:text-red-300 mb-4">{message}</p>
            <div className="flex flex-col space-y-3">
              <Link to="/login">
                <button className="w-full bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Go to Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="w-full bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-300 py-2 px-4 rounded-md border border-blue-500 dark:border-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Back to Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 