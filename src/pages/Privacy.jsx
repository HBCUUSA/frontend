import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Privacy = () => {
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Privacy Policy</h1>
              <p className="text-base sm:text-lg text-gray-600">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </motion.div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 mb-8">
              <div className="prose prose-blue max-w-none prose-headings:text-lg prose-headings:sm:text-xl prose-headings:font-semibold prose-p:text-sm prose-p:sm:text-base prose-li:text-sm prose-li:sm:text-base">
                <h2>1. Introduction</h2>
                <p>
                  HBCUUSA ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                <p>
                  We value the trust you place in us and are committed to ensuring that your privacy is protected. Please read this 
                  Privacy Policy carefully. By accessing or using our Service, you consent to the collection, use, and disclosure of 
                  your information as described in this Privacy Policy.
                </p>

                <h2>2. Information We Collect</h2>
                <h3>2.1 Information You Provide</h3>
                <p>
                  We collect information that you provide directly to us, such as when you:
                </p>
                <ul>
                  <li>Create an account (name, email address, password, college/university)</li>
                  <li>Complete your profile (education information, skills, interests)</li>
                  <li>Apply to programs or opportunities through our platform</li>
                  <li>Submit contributions, stories, or testimonials</li>
                  <li>Contact us or provide feedback</li>
                </ul>

                <h3>2.2 Information Collected Automatically</h3>
                <p>
                  When you use our Service, we may automatically collect certain information, including:
                </p>
                <ul>
                  <li>Log information (IP address, browser type, referring/exit pages, operating system)</li>
                  <li>Device information (device ID, hardware model)</li>
                  <li>Usage information (pages viewed, features used, time spent)</li>
                  <li>Location information (general location based on IP address)</li>
                </ul>

                <h3>2.3 Information from Third Parties</h3>
                <p>
                  If you choose to sign in or connect your account with a third-party service (such as Google), we may receive 
                  information from that service, such as your name, email address, and profile picture.
                </p>

                <h2>3. How We Use Your Information</h2>
                <p>
                  We use the information we collect for various purposes, including to:
                </p>
                <ul>
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Create and manage your account</li>
                  <li>Process applications to programs and opportunities</li>
                  <li>Match you with relevant programs and opportunities</li>
                  <li>Communicate with you about our Service, including updates and notifications</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Protect against misuse or unauthorized use of our Service</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2>4. Information Sharing and Disclosure</h2>
                <p>
                  We may share your information as follows:
                </p>
                <ul>
                  <li><strong>With Program Providers:</strong> When you apply to a program or opportunity, we share relevant information with the program providers.</li>
                  <li><strong>With Service Providers:</strong> We may share your information with third-party vendors who perform services on our behalf.</li>
                  <li><strong>With Your Consent:</strong> We may share your information when you direct us to do so or provide consent.</li>
                  <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law or if we believe it's necessary to protect our rights or the safety of our users.</li>
                </ul>

                <h2>5. Security</h2>
                <p>
                  We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized 
                  access. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h2>6. Your Choices</h2>
                <p>
                  You have several choices regarding the information you provide to us:
                </p>
                <ul>
                  <li><strong>Account Information:</strong> You can update or correct your account information at any time by accessing your account settings.</li>
                  <li><strong>Cookies:</strong> Most web browsers are set to accept cookies by default. You can adjust your browser settings to remove or reject cookies.</li>
                  <li><strong>Marketing Communications:</strong> You can opt out of receiving promotional emails by following the instructions in those emails.</li>
                </ul>

                <h2>7. Data Retention</h2>
                <p>
                  We retain your information as long as your account is active or as needed to provide you with our Service. 
                  We may retain information even after you've closed your account if necessary to comply with legal obligations, 
                  resolve disputes, or prevent fraud.
                </p>

                <h2>8. Children's Privacy</h2>
                <p>
                  Our Service is not directed to children under 13, and we do not knowingly collect personal information from 
                  children under 13. If we learn that we have collected personal information of a child under 13, we will take 
                  steps to delete such information as soon as possible.
                </p>

                <h2>9. Changes to this Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, 
                  legal, or regulatory reasons. We will notify you of any material changes by posting the updated Privacy Policy on 
                  our website or through other communication channels.
                </p>

                <h2>10. Contact Us</h2>
                <p>
                  If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at 
                  <a href="mailto:privacy@hbcuusa.org" className="text-blue-600 hover:underline ml-1">privacy@hbcuusa.org</a>.
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

export default Privacy;
