import { useState } from 'react';
import ElegantPagination from '../../components/ElegantPagination/ElegantPagination';
import Enhanced3DBookStack from '../../components/Showcase3DIcons/Enhanced3DBookStack';
import './ResourcesPage.css'

const ResourcesPage = () => {
  const resources = [
    { id: 1, title: "Guide to Writing Scholarship Essays", description: "Tips and tricks for crafting compelling essays.", link: "#" },
    { id: 2, title: "Financial Planning for Students", description: "A comprehensive guide to managing your finances.", link: "#" },
    { id: 3, title: "Scholarship Application Timeline", description: "A month-by-month guide to applying for scholarships.", link: "#" },
    { id: 4, title: "International Student Resources", description: "Special resources and tips for international students.", link: "#" },
    { id: 5, title: "Interview Preparation Guide", description: "How to prepare for scholarship interviews.", link: "#" },
    { id: 6, title: "Understanding Financial Aid", description: "A complete guide to different types of financial aid.", link: "#" },
  ];

  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(resources.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentResources = resources.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ paddingTop: '100px', color: 'white', maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
      <div className="hub-header">
        <div className="page-icon-container">
          <Enhanced3DBookStack />
        </div>
        <h1>Helpful Resources</h1>
        <p>
          Curated articles, tools, and guides to aid your scholarship journey. Explore practical tips, planning advice, and resources for every step of your application process.
        </p>
      </div>

      {/* Resources with Pagination */}
      {currentResources.map(resource => (
        <div key={resource.id} className="glassmorphism-box" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: '0', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>{resource.title}</h3>
          <p style={{ lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{resource.description}</p>
          <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD1DC', textDecoration: 'underline' }}>Learn More</a>
        </div>
      ))}

      {totalPages > 1 && (
        <ElegantPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ResourcesPage 