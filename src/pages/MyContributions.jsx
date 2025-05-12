import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

const MyContributions = () => {
  const { user, getAuthHeader } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContributions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Use the API endpoint instead of direct Firebase access
        const response = await axios.get(
          'http://localhost:5001/api/contributions/my-contributions',
          getAuthHeader()
        );
        
        setContributions(response.data);
      } catch (err) {
        console.error("Error fetching contributions:", err);
        
        // Check if we have an index URL in the error response
        if (err.response?.data?.indexUrl) {
          setError(
            `Database index required. Please try again later or notify the administrator. 
            If you are the administrator, you can create the index here: ${err.response.data.indexUrl}`
          );
        } else {
          setError("Failed to load your contributions. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [user, getAuthHeader]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-800 dark:text-yellow-200 p-4 rounded">
            <p>Please log in to view your contributions.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">My Contributions</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-800 dark:text-red-200 p-4 rounded">
            {error}
          </div>
        ) : contributions.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
            <p className="dark:text-white">You haven't made any contributions yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contributions.map((contribution) => (
              <div key={contribution.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">{contribution.name}</h2>
                <a 
                  href={contribution.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline mb-3 inline-block"
                >
                  {contribution.website}
                </a>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{contribution.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    Status: <span className={`font-medium ${
                      contribution.status === 'approved' ? 'text-green-600 dark:text-green-400' : 
                      contribution.status === 'rejected' ? 'text-red-600 dark:text-red-400' : 
                      'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                    </span>
                    {contribution.status === 'rejected' && contribution.rejectionReason && (
                      <div className="text-xs text-red-500 mt-1">
                        Reason: {contribution.rejectionReason}
                      </div>
                    )}
                  </span>
                  <span>
                    {formatDate(contribution.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyContributions; 