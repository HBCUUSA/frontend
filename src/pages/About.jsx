import React, { useEffect } from 'react';

export default function About() {
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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-100 dark:bg-gray-800 font-body">
        {/* Image Section - Full size, responsive */}
        <section className="max-w-6xl mx-auto">
          <div className="w-full h-[400px] md:h-[500px] overflow-hidden">
            <img
              src="img/9404239828_0443447145_o.jpg"
              alt="HBCU Campus"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </section>

        {/* Welcome Section */}
        <section className="bg-white dark:bg-gray-900 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            {/* Welcome Content */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white text-center sm:text-left">
              Welcome to HBCUUSA: A HBCU & MSI Initiative
            </h2>
            <div className="space-y-4 max-w-4xl">
              <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                Do you want to take advantage of opportunities and gain industry experience during college? 
                Do you see your friends' posts about scholarships and wonder where they applied from?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                HBCUUSA is a community for HBCU and MSI students to find internships, fellowships, and CSR programs. 
                We connect students with Corporate Social Responsibility (CSR) initiatives and fellowships designed 
                to promote diversity, inclusion, and social impact.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="bg-white dark:bg-gray-900 py-4 sm:py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="max-w-4xl">
              {/* Mission Section */}
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white text-center sm:text-left">
                Our Mission
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-10">
                Our mission is to <strong>empower HBCU and MSI students</strong> with resources, opportunities, 
                and information about CSR initiatives that support their personal and professional development.
              </p>

              {/* Vision Section */}
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white text-center sm:text-left">
                Our Vision
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                We envision a future where <strong>every student</strong>, regardless of background, has equal access 
                to growth opportunities and can make a <strong>positive impact</strong> in their communities.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 dark:bg-gray-900 text-white py-6 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm sm:text-base">&copy; 2025 Copyright: All Rights Reserved by HBCUUSA</p>
        </div>
      </footer>
    </div>
  );
}
