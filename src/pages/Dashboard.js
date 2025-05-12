import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Searchbox from '../components/Searchbox';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
const baseURL = process.env.REACT_APP_BASE_URL

const Dashboard = () => {
  const { user, getAuthHeader } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch programs from backend API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${baseURL}/api/programs`);
        setPrograms(response.data);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError("Failed to load programs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrograms();
  }, []);

  // Handle search and filter
  const handleSearch = async (searchTerm) => {
    setSearchValue(searchTerm);
    fetchFilteredPrograms(searchTerm, selectedMonth);
  };
  
  const handleMonthSelect = async (month) => {
    setSelectedMonth(month);
    fetchFilteredPrograms(searchValue, month);
  };
  
  const fetchFilteredPrograms = async (search, month) => {
    try {
      setLoading(true);
      
      // Only add parameters that have values
      const params = {};
      if (search) params.search = search;
      if (month) params.month = month;
      
      const response = await axios.get(`${baseURL}/api/programs/filter`, { params });
      setPrograms(response.data);
    } catch (err) {
      console.error("Error fetching filtered programs:", err);
      setError("Failed to filter programs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Searchbox onSearch={handleSearch} onMonthSelect={handleMonthSelect} />

      <main className="flex-1 bg-gray-100 dark:bg-gray-800 min-h-screen font-body">
        <div className="container mx-auto">
          <section className="opportunities bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:bg-gray-800 p-4 rounded-lg">
            <div className="opportunity-header flex justify-between items-center mb-4 dark:text-white">
              <span>Programs</span>
              <span>Application opens</span>
            </div>
            
            {loading && (
              <div className="text-center py-4">
                <p className="text-white">Loading programs...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            {!loading && !error && programs.length === 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-md text-center">
                <p className="dark:text-white">No programs found matching your criteria.</p>
              </div>
            )}
            
            <div className="space-y-4">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="opportunity bg-white dark:bg-gray-900 p-4 rounded-md shadow-md border-2 hover:border-gradient transition-all duration-300 ease-in-out"
                >
                  <h2 className="text-lg font-bold mb-2 dark:text-white cursor-pointer font-body">{program.name}</h2>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-400">{program.applicationMonth}</p>
                    <a href={program.applicationLink} className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-800">Apply</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Outlet /> {/* Nested routes like About and Map render here */}
      <Footer />
    </div>
    
  );
};

export default Dashboard;