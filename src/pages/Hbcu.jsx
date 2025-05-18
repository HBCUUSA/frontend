import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    // Add viewport meta tag dynamically for mobile optimization
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    document.head.appendChild(metaViewport);

    return () => {
      document.head.removeChild(metaViewport);
    };
  }, []);

  // Close profile dropdown if clicking outside
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    async function fetchCsvData() {
      try {
        const response = await fetch(process.env.PUBLIC_URL + '/img/HBCU.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch CSV data');
        }
        const data = await response.text();
        const rows = data.split('\n');
        const tableBody = document.querySelector('#universityTable tbody');

        // Clear the table body to prevent duplicate data
        tableBody.innerHTML = '';

        let rowNumber = 1;
        for (let i = 1; i < rows.length; i++) {
          const columns = rows[i].split(',');
          const tr = document.createElement('tr');
          tr.classList.add('border-b', 'dark:border-gray-600', 'hover:bg-gray-50', 'dark:hover:bg-gray-700');

          const numberCell = document.createElement('td');
          numberCell.classList.add('px-2', 'sm:px-4', 'py-2', 'text-center');
          numberCell.textContent = rowNumber;
          tr.appendChild(numberCell);

          columns.forEach((column, index) => {
            const td = document.createElement('td');
            td.classList.add('px-2', 'sm:px-4', 'py-2', 'break-words');

            // Add responsive text sizing
            if (index === 0) {
              td.classList.add('text-sm', 'sm:text-base', 'font-medium');
            }

            if (index === 1) {
              const link = document.createElement('a');
              link.href = column.trim();
              link.textContent = column.trim();
              link.classList.add(
                'text-blue-500',
                'hover:text-blue-700',
                'dark:text-blue-400',
                'dark:hover:text-blue-300',
                'text-sm',
                'sm:text-base',
                'break-all'
              );
              // Make links more tappable on mobile
              link.classList.add('py-1', 'inline-block');
              td.appendChild(link);
            } else {
              td.textContent = column.trim();
            }
            tr.appendChild(td);
          });

          tableBody.appendChild(tr);
          rowNumber++;
        }
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    }

    fetchCsvData();
  }, []); // Add an empty dependency array

  return (
    <div className="relative min-h-screen bg-white flex">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-70"></div>
      
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        sidebarRef={sidebarRef}
        user={user}
      />
      
      {/* Main Content */}
      <div className={`relative z-10 flex-1`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 w-full">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              {/* Sidebar toggle for mobile */}
              <button
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isSidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="pl-2"
              >
                <Link to="/">
                  <img 
                    src="/img/logo-no-background.png" 
                    alt="HBCU Logo" 
                    className="w-40 h-auto"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {/* Show user profile when logged in */}
              {user ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} 
                    className="focus:outline-none"
                  >
                    <img
                      src={user.photoURL || "/default-avatar.png"} // Profile pic or default
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-gray-300"
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-2 text-gray-900 border-b border-gray-200">
                        <p className="font-semibold">{user.displayName || "User"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>

                      {/* Profile Link */}
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        View Profile
                      </Link>

                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Log In
                  </Link>
                  <Link to="/signup">
                    <button className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <Map />
          <main className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">
              HBCU Universities Database
            </h1>

            <div className="overflow-x-auto">
              <table id="universityTable" className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-blue-800 dark:bg-gray-900 text-white">
                    <th className="px-2 sm:px-4 py-2 w-10">#</th>
                    <th className="px-2 sm:px-4 py-2">College / University</th>
                    <th className="px-2 sm:px-4 py-2">URL</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800"></tbody>
              </table>
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              &copy; 2024 HBCUUSA. All Rights Reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
