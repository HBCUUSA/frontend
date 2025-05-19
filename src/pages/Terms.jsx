import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Terms = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);

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
          <main className="max-w-4xl mx-auto px-6 py-12">
            <motion.div 
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-600">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </motion.div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <div className="prose prose-blue max-w-none">
                <h2>1. Agreement to Terms</h2>
                <p>
                  By accessing or using HBCUUSA ("the Service"), you agree to be bound by these Terms of Service 
                  ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
                </p>
                <p>
                  We may modify these Terms at any time. If we make changes, we will provide notice of such 
                  changes by revising the date at the top of these Terms. Your continued use of the Service 
                  following the posting of the revised Terms means you accept the changes.
                </p>

                <h2>2. Privacy Policy</h2>
                <p>
                  Please refer to our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> for 
                  information about how we collect, use, and disclose information about you.
                </p>

                <h2>3. Account Registration</h2>
                <p>
                  To access certain features of the Service, you may need to register for an account. When you 
                  register, you agree to:
                </p>
                <ul>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account and password</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p>
                  We reserve the right to disable any account at any time, including if we believe you have 
                  violated these Terms.
                </p>

                <h2>4. User Content</h2>
                <p>
                  Our Service allows you to post, link, store, share, and otherwise make available certain 
                  information, text, graphics, videos, or other material ("User Content"). You are responsible 
                  for the User Content that you post, including its legality, reliability, and appropriateness.
                </p>
                <p>
                  By posting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, 
                  copy, modify, create derivative works from, distribute, publicly display, and publicly perform 
                  your User Content in connection with operating and providing the Service.
                </p>
                <p>
                  You represent and warrant that:
                </p>
                <ul>
                  <li>You own or have the necessary rights to use and authorize us to use all intellectual property rights in and to any User Content</li>
                  <li>The User Content does not violate these Terms or any applicable law</li>
                  <li>The User Content will not cause injury to any person or entity</li>
                </ul>

                <h2>5. Prohibited Conduct</h2>
                <p>
                  You agree not to:
                </p>
                <ul>
                  <li>Violate any applicable law or regulation</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity</li>
                  <li>Engage in any activity that interferes with or disrupts the Service</li>
                  <li>Attempt to access any service or area of the Service that you are not authorized to access</li>
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Post any User Content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, or otherwise objectionable</li>
                  <li>Use any automated system to access the Service</li>
                  <li>Introduce any viruses, malware, or other harmful code</li>
                </ul>

                <h2>6. Intellectual Property Rights</h2>
                <p>
                  The Service and its contents, features, and functionality are owned by HBCUUSA and are protected 
                  by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, 
                  modify, create derivative works of, publicly display, or use any content from our Service without 
                  prior written consent.
                </p>

                <h2>7. Termination</h2>
                <p>
                  We may terminate or suspend your account and access to the Service at our sole discretion, without 
                  notice, for any reason, including if you breach these Terms. Upon termination, your right to use 
                  the Service will immediately cease.
                </p>

                <h2>8. Disclaimer of Warranties</h2>
                <p>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
                  OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, 
                  EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                  PURPOSE, AND NON-INFRINGEMENT.
                </p>

                <h2>9. Limitation of Liability</h2>
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL HBCUUSA, ITS AFFILIATES, OR THEIR 
                  LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR ANY 
                  INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, 
                  PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS 
                  OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, WHETHER CAUSED 
                  BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.
                </p>

                <h2>10. Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless HBCUUSA, its affiliates, and their respective 
                  officers, directors, employees, and agents from and against any claims, liabilities, damages, 
                  judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) 
                  arising out of or relating to your violation of these Terms or your use of the Service.
                </p>

                <h2>11. Governing Law</h2>
                <p>
                  These Terms and your use of the Service are governed by and construed in accordance with the laws 
                  of the United States and the State of Delaware, without giving effect to any choice or conflict of 
                  law provision or rule.
                </p>

                <h2>12. Dispute Resolution</h2>
                <p>
                  Any legal action or proceeding relating to your access to, or use of, the Service or these Terms 
                  shall be instituted in a state or federal court in Delaware, and you agree to submit to the 
                  jurisdiction of such courts.
                </p>

                <h2>13. Waiver and Severability</h2>
                <p>
                  Our failure to exercise or enforce any right or provision of these Terms shall not constitute a 
                  waiver of such right or provision. If any provision of these Terms is found to be invalid or 
                  unenforceable, the remaining provisions shall remain in full force and effect.
                </p>

                <h2>14. Entire Agreement</h2>
                <p>
                  These Terms constitute the entire agreement between you and HBCUUSA regarding the Service and 
                  supersede all prior and contemporaneous agreements, representations, and understandings.
                </p>

                <h2>15. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at{' '}
                  <a href="mailto:legal@hbcuusa.org" className="text-blue-600 hover:underline">legal@hbcuusa.org</a>.
                </p>
              </div>
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </div>
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
};

export default Terms;
