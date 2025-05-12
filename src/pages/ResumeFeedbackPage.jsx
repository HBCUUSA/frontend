import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResumeFeedback from '../components/ResumeFeedback';
import axios from 'axios';

const ResumeFeedbackPage = () => {
  const { userId } = useParams();
  const { user, getAuthHeader } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resume data when component mounts
  useEffect(() => {
    const fetchResumeData = async () => {
      if (!user || !userId) return;
      
      try {
        const response = await axios.get(
          `http://localhost:5001/api/resume/user/${userId}`,
          getAuthHeader()
        );
        
        setResumeData(response.data);
      } catch (err) {
        console.error('Error fetching resume data:', err);
        setError(err.response?.data?.message || 'Failed to load resume data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResumeData();
  }, [user, userId, getAuthHeader]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Please log in to view and provide resume feedback
            </p>
            <Link 
              to="/login" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header / Navigation */}
        <div className="mb-6 flex items-center">
          <Link 
            to="/public-resumes" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Public Resumes
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Resume Header Section - Reddit Style */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {loading ? (
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                ) : (
                  resumeData?.photoURL ? (
                    <img 
                      src={resumeData.photoURL} 
                      alt={resumeData.userName} 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                        {resumeData?.userName?.charAt(0).toUpperCase() || userId.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? (
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    `${resumeData?.userName || 'User'}'s Resume`
                  )}
                </h1>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>Posted by {resumeData?.userName || 'User'}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {loading ? (
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                      resumeData?.resumeUpdatedAt ? 
                        `Updated ${new Date(resumeData.resumeUpdatedAt?.toDate?.() || resumeData.resumeUpdatedAt).toLocaleDateString()}` : 
                        'Recently'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Preview Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Resume Preview
              </h2>
              {!loading && resumeData?.resumeURL && (
                <a 
                  href={resumeData.resumeURL}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Resume
                </a>
              )}
            </div>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              {loading ? (
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              ) : (
                resumeData?.resumeURL && resumeData.resumeURL.includes('.pdf') ? (
                  <iframe
                    src={`${resumeData.resumeURL}#toolbar=0&navpanes=0`}
                    className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-md"
                    title="Resume Preview"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 dark:text-gray-400">
                      {resumeData?.resumeURL ? 'Resume preview not available' : 'No resume uploaded yet'}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* User Details Section */}
          {!loading && resumeData && (
            <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4">
                {resumeData.college && (
                  <div className="flex items-center text-sm">
                    <svg className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{resumeData.college}</span>
                  </div>
                )}
                {resumeData.major && (
                  <div className="flex items-center text-sm">
                    <svg className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{resumeData.major}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feedback Thread Section */}
          <div className="p-6">
            <ResumeFeedback userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeFeedbackPage; 