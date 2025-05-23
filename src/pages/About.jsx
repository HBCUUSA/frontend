import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function About() {
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
      // Check if the element still exists before trying to remove it
      if (document.head.contains(metaViewport)) {
        document.head.removeChild(metaViewport);
      }
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
          <main className="bg-transparent dark:bg-gray-800 font-body">
            {/* Image Section - Full size, responsive */}
            <section className="max-w-6xl mx-auto">
              <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
                <img
                  src="img/9404239828_0443447145_o.jpg"
                  alt="HBCU Campus"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </section>

            {/* Welcome Section */}
            <section className="bg-transparent dark:bg-gray-900 py-6 sm:py-8 md:py-12">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Welcome Content */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 dark:text-white text-center sm:text-left">
                  Welcome to HBCUUSA: A HBCU & MSI Initiative
                </h2>
                <div className="space-y-3 sm:space-y-4 max-w-4xl">
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Do you want to take advantage of opportunities and gain industry experience during college? 
                    Do you see your friends' posts about scholarships and wonder where they applied from?
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    HBCUUSA is a community for HBCU and MSI students to find internships, fellowships, and CSR programs. 
                    We connect students with Corporate Social Responsibility (CSR) initiatives and fellowships designed 
                    to promote diversity, inclusion, and social impact.
                  </p>
                </div>
              </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="bg-transparent dark:bg-gray-900 py-4 sm:py-6">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="max-w-4xl">
                  {/* Mission Section */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6 dark:text-white text-center sm:text-left">
                    Our Mission
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-10">
                    Our mission is to <strong>empower HBCU and MSI students</strong> with resources, opportunities, 
                    and information about CSR initiatives that support their personal and professional development.
                  </p>

                  {/* Vision Section */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6 dark:text-white text-center sm:text-left">
                    Our Vision
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    We envision a future where <strong>every student</strong>, regardless of background, has equal access 
                    to growth opportunities and can make a <strong>positive impact</strong> in their communities.
                  </p>
                </div>
              </div>
            </section>
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
