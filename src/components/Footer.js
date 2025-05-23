import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 mt-auto bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} HBCUUSA. All Rights Reserved.
        </p>
        <div className="flex space-x-6">
          <Link to="/privacy" className="text-gray-400 hover:text-gray-600">
            Privacy
          </Link>
          <Link to="/terms" className="text-gray-400 hover:text-gray-600">
            Terms
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-gray-600">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 