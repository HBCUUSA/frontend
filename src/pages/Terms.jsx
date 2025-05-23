import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Terms = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const sidebarRef = useRef(null);

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
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <motion.div 
              className="mb-8 sm:mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Terms of Service</h1>
              <p className="text-base sm:text-lg text-gray-600">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </motion.div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 mb-8">
              <div className="prose prose-blue max-w-none prose-headings:text-lg prose-headings:sm:text-xl prose-headings:font-semibold prose-p:text-sm prose-p:sm:text-base prose-li:text-sm prose-li:sm:text-base">
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
