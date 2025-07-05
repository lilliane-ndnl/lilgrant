import { useState } from 'react';
import ElegantPagination from '../../components/ElegantPagination/ElegantPagination';
import Enhanced3DLaptop from '../../components/Showcase3DIcons/3DQuill';
import './BlogPage.css'

const BlogPage = () => {
  const articles = [
    { id: 1, title: "Top 5 Scholarship Application Mistakes to Avoid", date: "June 1, 2025", snippet: "Learn about common pitfalls and how to ensure your application stands out...", link: "#" },
    { id: 2, title: "Navigating Scholarship Interviews Like a Pro", date: "May 20, 2025", snippet: "Tips for preparing and acing your scholarship interviews...", link: "#" },
    { id: 3, title: "How to Find the Perfect Scholarship Match", date: "May 15, 2025", snippet: "Discover strategies for finding scholarships that align with your goals...", link: "#" },
    { id: 4, title: "Writing a Winning Personal Statement", date: "May 10, 2025", snippet: "Expert tips on crafting a compelling personal statement...", link: "#" },
    { id: 5, title: "Understanding Scholarship Requirements", date: "May 5, 2025", snippet: "A comprehensive guide to common scholarship requirements...", link: "#" },
    { id: 6, title: "Managing Multiple Scholarship Applications", date: "May 1, 2025", snippet: "Learn how to efficiently manage multiple scholarship applications...", link: "#" },
  ];

  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ paddingTop: '100px', color: 'white', maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
      <div className="hub-header">
        <div className="page-icon-container">
          <Enhanced3DLaptop />
        </div>
        <h1>LilGrant Blog & Articles</h1>
        <p>
          Tips, news, and opinions about scholarships from Lilliane and the community. Read the latest insights and advice to help you succeed on your scholarship journey.
        </p>
      </div>
      
      {currentArticles.map(article => (
        <div key={article.id} className="glassmorphism-box" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: '0', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>{article.title}</h3>
          <p style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}><em>Posted on: {article.date}</em></p>
          <p style={{ lineHeight: '1.6', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{article.snippet}</p>
          <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD1DC', textDecoration: 'underline' }}>Read Full Article</a>
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

export default BlogPage; 