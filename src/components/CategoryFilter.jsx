import React from 'react';
import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  // Category icons mapping
  const categoryIcons = {
    Sports: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    HBCU: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    Startup: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    All: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  };

  return (
    <div className="w-full mb-10">
      <div className="flex justify-center">
        <div className="overflow-x-auto hide-scrollbar pb-2">
          <div className="flex space-x-4 px-2 min-w-max">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory('All')}
              className={`flex flex-col items-center cursor-pointer transition-all ${
                selectedCategory === 'All' ? 'scale-105' : ''
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                selectedCategory === 'All' 
                  ? 'bg-blue-100 text-blue-600 shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}>
                {categoryIcons.All}
              </div>
              <span className={`text-xs font-medium ${
                selectedCategory === 'All' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                All
              </span>
            </motion.div>

            {categories.map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory(category)}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  selectedCategory === category ? 'scale-105' : ''
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                  selectedCategory === category 
                    ? 'bg-blue-100 text-blue-600 shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}>
                  {categoryIcons[category] || (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs font-medium ${
                  selectedCategory === category ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add a subtle separator */}
      <div className="border-b border-gray-100 mt-4"></div>
    </div>
  );
};

export default CategoryFilter; 