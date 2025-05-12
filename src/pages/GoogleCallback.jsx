import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // This page is no longer needed with the new Google Identity Services approach,
    // as authentication is handled directly through the callback in AuthContext
    
    // Simply check if the user is logged in and redirect accordingly
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        navigate('/dashboard');
      } else {
        // No authenticated user, redirect to login
        navigate('/login');
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 flex justify-center items-center bg-gray-100 dark:bg-gray-800 font-body">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Completing Sign In...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Please wait while we complete your sign in process.
          </p>
        </div>
      </main>
    </div>
  );
};

export default GoogleCallback; 