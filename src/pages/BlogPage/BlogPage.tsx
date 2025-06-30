import './BlogPage.css'

const BlogPage = () => {
  const articles = [
    { id: 1, title: "Top 5 Scholarship Application Mistakes to Avoid", date: "June 1, 2025", snippet: "Learn about common pitfalls and how to ensure your application stands out...", link: "#" },
    { id: 2, title: "Navigating Scholarship Interviews Like a Pro", date: "May 20, 2025", snippet: "Tips for preparing and acing your scholarship interviews...", link: "#" },
  ];

  return (
    <div style={{ paddingTop: '100px', color: 'white', maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>LilGrant Blog & Articles</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>Tips, news, and opinions about scholarships from Lilliane and the community.</p>
      {articles.map(article => (
        <div key={article.id} className="glassmorphism-box" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: '0', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>{article.title}</h3>
          <p style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}><em>Posted on: {article.date}</em></p>
          <p style={{ lineHeight: '1.6', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{article.snippet}</p>
          <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD1DC', textDecoration: 'underline' }}>Read Full Article</a>
        </div>
      ))}
      {/* Note: In the future, this content will come from dedicated data files or a CMS. */}
    </div>
  );
};

export default BlogPage; 