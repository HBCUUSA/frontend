import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
const baseURL = process.env.REACT_APP_API_URL

const ResumeUpload = ({ showPreview = false }) => {
  const { user, getAuthHeader } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Fetch current resume when component mounts
  useEffect(() => {
    const fetchResume = async () => {
      if (!user) return;
      
      try {
        const response = await axios.get(
          `{baseURL}/api/resume`,
          getAuthHeader()
        );
        
        setCurrentResume(response.data);
        setIsPublic(response.data.isPublic || false);
        
        // Set preview URL if showing preview
        if (showPreview && response.data.resumeURL) {
          setPreviewUrl(response.data.resumeURL);
        }
        
        // Hide upload form if resume exists
        setShowUploadForm(false);
        setShowUploadModal(false);
      } catch (err) {
        if (err.response?.status === 404) {
          // No resume found, show upload form
          setShowUploadForm(true);
        } else {
          console.error('Error fetching resume:', err);
          setError('Failed to load resume information');
        }
      }
    };
    
    fetchResume();
  }, [user, getAuthHeader, showPreview]);

  // Handle file selection
  const handleFileChange = (e) => {
    setError(null);
    setSuccess(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      
      if (!allowedExtensions.includes(fileExtension)) {
        setError('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      
      setResumeFile(file);
      
      // Create preview URL for PDF files
      if (fileExtension === 'pdf' && showPreview) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        
        // Clean up the URL when component unmounts
        return () => URL.revokeObjectURL(objectUrl);
      } else if (showPreview) {
        // For non-PDF files, show a placeholder
        setPreviewUrl(null);
      }
    }
  };

  // Handle resume upload
  const handleUpload = async () => {
    if (!resumeFile) {
      setError('Please select a file to upload');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      const response = await axios.post(
        `{baseURL}/api/resume/upload`,
        formData,
        {
          ...getAuthHeader(),
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setCurrentResume({
        resumeURL: response.data.resumeURL,
        resumeName: response.data.resumeName,
        resumeUpdatedAt: new Date(),
        isPublic: response.data.isPublic || false
      });
      
      // Update preview URL if showing preview
      if (showPreview) {
        setPreviewUrl(response.data.resumeURL);
      }
      
      // Update isPublic state
      setIsPublic(response.data.isPublic || false);
      
      setSuccess('Resume uploaded successfully');
      setResumeFile(null);
      setShowUploadForm(false);
      setShowUploadModal(false);
      
      // Reset file input
      const fileInput = document.getElementById('resume-file');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  // Handle resume deletion
  const handleDelete = async () => {
    if (!currentResume) return;
    
    if (!window.confirm('Are you sure you want to delete your resume?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await axios.delete(
        `{baseURL}/api/resume`,
        getAuthHeader()
      );
      
      setCurrentResume(null);
      setPreviewUrl(null);
      setSuccess('Resume deleted successfully');
      setShowUploadForm(true);
    } catch (err) {
      console.error('Error deleting resume:', err);
      setError(err.response?.data?.message || 'Failed to delete resume');
    } finally {
      setLoading(false);
    }
  };

  // Toggle resume public status
  const togglePublicStatus = async () => {
    setToggleLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.put(
        `{baseURL}/api/resume/toggle-public`,
        {},
        getAuthHeader()
      );
      
      setIsPublic(response.data.isPublic);
      setSuccess(response.data.message);
    } catch (err) {
      console.error('Error toggling resume visibility:', err);
      setError(err.response?.data?.message || 'Failed to update resume visibility');
    } finally {
      setToggleLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center p-4">Please log in to manage your resume</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-100 text-green-700 border-l-4 border-green-500">
          {success}
        </div>
      )}
      
      {/* Resume Preview Section */}
      {currentResume && previewUrl && (
        <div className="relative">
          {/* Resume Actions - Changed from absolute positioning to centered flex container */}
          <div className="flex justify-center space-x-4 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Replace
            </button>
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          
          {/* Resume Info */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">{currentResume.resumeName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Uploaded: {new Date(currentResume.resumeUpdatedAt).toLocaleString()}
              </p>
            </div>
            <a 
              href={currentResume.resumeURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Open
            </a>
          </div>
          
          {/* PDF Preview */}
          {previewUrl && previewUrl.includes('.pdf') && (
            <div className="border-t border-gray-200 dark:border-gray-700">
              <iframe
                src={`${previewUrl}#view=FitH`}
                title="Resume Preview"
                className="w-full h-[800px]"
              ></iframe>
            </div>
          )}
          
          {/* Non-PDF file message */}
          {previewUrl && !previewUrl.includes('.pdf') && (
            <div className="p-8 bg-gray-50 dark:bg-gray-800 text-center border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Preview not available</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  This file type cannot be previewed directly in the browser.
                </p>
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  Download Resume
                </a>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Upload Form Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {currentResume ? 'Replace Your Resume' : 'Upload Your Resume'}
                </h2>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload a professional resume to showcase your skills and experience.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="resume-file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <label htmlFor="resume-file" className="cursor-pointer block">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  
                  <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                    <span className="relative bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      {resumeFile ? resumeFile.name : 'Select a file'}
                    </span>
                    {!resumeFile && <p className="pl-1">or drag and drop</p>}
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    PDF, DOC, DOCX up to 5MB
                  </p>
                </label>
                
                {resumeFile && (
                  <div className="mt-4 flex items-center justify-center">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {resumeFile.name}
                    </span>
                    <button 
                      onClick={() => {
                        setResumeFile(null);
                        const fileInput = document.getElementById('resume-file');
                        if (fileInput) fileInput.value = '';
                      }}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!resumeFile || loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    <span>{currentResume ? 'Replace Resume' : 'Upload Resume'}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Form (for initial upload only) */}
      {(showUploadForm && !currentResume) && (
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              Upload Your Resume
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Upload a professional resume to showcase your skills and experience.
            </p>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <input
              type="file"
              id="resume-file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <label htmlFor="resume-file" className="cursor-pointer block">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              
              <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                <span className="relative bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  {resumeFile ? resumeFile.name : 'Select a file'}
                </span>
                {!resumeFile && <p className="pl-1">or drag and drop</p>}
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                PDF, DOC, DOCX up to 5MB
              </p>
            </label>
            
            {resumeFile && (
              <div className="mt-4 flex items-center justify-center">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {resumeFile.name}
                </span>
                <button 
                  onClick={() => {
                    setResumeFile(null);
                    const fileInput = document.getElementById('resume-file');
                    if (fileInput) fileInput.value = '';
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleUpload}
              disabled={!resumeFile || loading}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                <span>Upload Resume</span>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Public toggle switch */}
      <div className="mt-4 flex items-center">
        <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Make resume public for feedback
        </span>
        <button
          type="button"
          onClick={togglePublicStatus}
          disabled={toggleLoading}
          className={`${
            isPublic ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          role="switch"
          aria-checked={isPublic}
        >
          <span
            aria-hidden="true"
            className={`${
              isPublic ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          ></span>
        </button>
        {toggleLoading && (
          <svg className="animate-spin ml-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {isPublic 
          ? "Your resume is public. Other users can view it and provide feedback."
          : "Your resume is private. Only you can see it."}
      </p>
    </div>
  );
};

export default ResumeUpload; 