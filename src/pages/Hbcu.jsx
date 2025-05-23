import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
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
        {/* Header - Using Navbar Component */}
        <Navbar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        {/* Page Content */}
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <Map />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 dark:text-white">
              HBCU Universities Database
            </h1>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <table id="universityTable" className="w-full border-collapse text-left text-sm sm:text-base">
                <thead>
                  <tr className="bg-blue-800 dark:bg-gray-900 text-white">
                    <th className="px-2 sm:px-4 py-2 w-10 text-xs sm:text-sm">#</th>
                    <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm">College / University</th>
                    <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm">URL</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 text-xs sm:text-sm"></tbody>
              </table>
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer />
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
