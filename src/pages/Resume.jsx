import React from 'react';
import { Link } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import { useAuth } from '../context/AuthContext';

const Resume = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Resume Management
        </h1>
        
        {!user ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Please log in to manage your resume
            </p>
            <a 
              href="/login" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Log In
            </a>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Upload your resume to make it available to potential employers and program administrators.
                  Your resume will be stored securely and can be updated at any time.
                </p>
                <Link 
                  to="/public-resumes"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap ml-4"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Browse Public Resumes
                </Link>
              </div>
              
              <ResumeUpload showPreview={true} />
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm p-6 border border-blue-100 dark:border-blue-800">
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Resume Feedback Feature
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Make your resume public to receive feedback from other users. You can also browse other public resumes and provide feedback to help others improve.
              </p>
              <div className="flex space-x-4">
                <Link 
                  to="/public-resumes"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Public Resumes
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Resume; 