import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  sidebarRef,
  user
}) => (
  <aside
    ref={sidebarRef}
    className={`fixed top-0 z-40 h-screen bg-white shadow-lg transform transition-all duration-300 ease-in-out w-64
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
  >
    {/* Collapse toggle button (only visible on desktop) */}
    <button
      className="hidden lg:flex absolute -right-3 top-20 bg-white h-6 w-6 rounded-full shadow-md cursor-pointer z-20 items-center justify-center"
      onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {isSidebarCollapsed ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        )}
      </svg>
    </button>
    <div className={`p-6 ${isSidebarCollapsed ? 'px-4' : ''}`}>
      <nav className="">
        <div className="space-y-2">
          <Link to="/programs"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
            ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="Programs"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            {!isSidebarCollapsed && <span className="ml-3">Programs</span>}
          </Link>
          <Link to="/experience"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
            ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="Experience"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            {!isSidebarCollapsed && <span className="ml-3">Experience</span>}
          </Link>
          <Link to="/hbcu"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
            ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="HBCU"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            {!isSidebarCollapsed && <span className="ml-3">HBCU</span>}
          </Link>
          <Link to="/about"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
            ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="About"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {!isSidebarCollapsed && <span className="ml-3">About</span>}
          </Link>
          {!isSidebarCollapsed && (
            <div className="py-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Add Programs</p>
            </div>
          )}
          {isSidebarCollapsed && (
            <div className="py-2 flex justify-center">
              <div className="w-8 border-t border-gray-200"></div>
            </div>
          )}
          <Link to="/contribute"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
            ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="Add New Program"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {!isSidebarCollapsed && <span className="ml-3">Add New Program</span>}
          </Link>
          <Link to="/resume"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
            ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="Upload Resume"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {!isSidebarCollapsed && <span className="ml-3">Upload Resume</span>}
          </Link>
          <Link to="/public-resumes"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
            ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="Browse Resumes"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
            </svg>
            {!isSidebarCollapsed && <span className="ml-3">Browse Resumes</span>}
          </Link>
          <Link to="/mentor"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
            ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="Find Mentors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {!isSidebarCollapsed && <span className="ml-3">Find Mentors</span>}
          </Link>
          {user && (
            <Link to="/my-contributions"
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors
              ${isSidebarCollapsed ? 'justify-center' : ''}`}
              title="My Contributions"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              {!isSidebarCollapsed && <span className="ml-3">My Contributions</span>}
            </Link>
          )}
        </div>
      </nav>
    </div>
  </aside>
);

export default Sidebar;
