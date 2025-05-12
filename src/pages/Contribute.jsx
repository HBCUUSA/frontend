import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

const Contribute = () => {
  const { user, getAuthHeader } = useAuth();
  const [data, setData] = useState({ name: "", website: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setLoginPrompt(true);
      setError("Please log in to contribute");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Submit contribution via API
      await axios.post(
        'http://localhost:5001/api/contributions',
        {
          name: data.name,
          website: data.website,
          description: data.description
        },
        getAuthHeader()
      );
      
      setSuccess("Thank you for your contribution! It will be reviewed shortly.");
      
      // Clear form after successful submission
      setData({ name: "", website: "", description: "" });
    } catch (error) {
      console.error("Error submitting contribution:", error);
      setError(error.response?.data?.message || "Failed to submit contribution. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-8 font-body">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md mb-8">
              <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Contribute by adding a program</h1>
              
              {loginPrompt && !user && (
                <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-800 dark:text-yellow-200 rounded">
                  <p>You need to be logged in to contribute.</p>
                  <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                    Go to Login
                  </Link>
                </div>
              )}
              
              {user && (
                <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-800 dark:text-blue-200 rounded">
                  <p>Want to see your previous contributions?</p>
                  <Link to="/my-contributions" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                    View My Contributions
                  </Link>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 dark:text-gray-300">Program Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Fellowship or program name..."
                    onChange={handleChange}
                    value={data.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block mb-1 dark:text-gray-300">Program Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    placeholder="Website URL (e.g., https://example.com)..."
                    onChange={handleChange}
                    value={data.website}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block mb-1 dark:text-gray-300">Program Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe the program, eligibility requirements, application process, etc..."
                    onChange={handleChange}
                    value={data.description}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    style={{ height: '200px' }}
                    required
                  ></textarea>
                </div>
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">{success}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Submitting...' : 'Submit Contribution'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Contribute;
