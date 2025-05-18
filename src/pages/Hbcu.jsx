import React, { useEffect, useState, useRef } from 'react';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const sidebarRef = useRef(null);

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
    <>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        sidebarRef={sidebarRef}
        user={null}
      />
      <div className={`min-h-screen bg-gray-100 dark:bg-gray-800 transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Map />
        <main className="p-4 sm:p-8 font-body">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white text-center sm:text-left">
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

        <footer className="bg-blue-800 dark:bg-gray-900 text-white py-4 mt-4 px-4 text-sm sm:text-base">
          <div className="container mx-auto text-center">
            <p>&copy;2024 Copyright: All Rights Reserved by HBCUUSA</p>
          </div>
        </footer>
      </div>
    </>
  );
}
