import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL
const PublicResumes = () => {
  const { user, getAuthHeader } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [colleges, setColleges] = useState([]);

  // Fetch public resumes when component mounts
  useEffect(() => {
    const fetchPublicResumes = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `${baseURL}/api/resume/public`,
          getAuthHeader()
        );
        
        setResumes(response.data);
        
        // Extract unique colleges for filtering
        const uniqueColleges = [...new Set(response.data.map(resume => resume.college))];
        setColleges(uniqueColleges.sort());
      } catch (err) {
        console.error('Error fetching public resumes:', err);
        setError(err.response?.data?.message || 'Failed to load public resumes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublicResumes();
  }, [user, getAuthHeader]);

  // Filter resumes based on search term and college filter
  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = searchTerm === '' || 
      resume.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCollege = collegeFilter === '' || 
      resume.college === collegeFilter;
    
    return matchesSearch && matchesCollege;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Please log in to view public resumes
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
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Public Resumes
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Browse resumes shared by other users. You can provide feedback to help them improve.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search by name
              </label>
              <input
                type="text"
                id="search"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1">
              <label htmlFor="college" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by college
              </label>
              <select
                id="college"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
              >
                <option value="">All Colleges</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No resumes found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || collegeFilter ? 'Try adjusting your filters' : 'No public resumes available yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <div key={resume.userId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    {resume.photoURL ? (
                      <img 
                        src={resume.photoURL} 
                        alt={resume.userName} 
                        className="h-12 w-12 rounded-full mr-4"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-4">
                        <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                          {resume.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {resume.userName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {resume.college}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Last updated: {new Date(resume.resumeUpdatedAt?.toDate?.() || resume.resumeUpdatedAt).toLocaleDateString()}
                  </p>
                  
                  <Link
                    to={`/resume-feedback/${resume.userId}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View & Provide Feedback
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicResumes; 