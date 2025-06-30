import './ResourcesPage.css'
import UniversityData from '../../components/UniversityData/UniversityData';

const ResourcesPage = () => {
  const resources = [
    { id: 1, title: "Guide to Writing Scholarship Essays", description: "Tips and tricks for crafting compelling essays.", link: "#" },
    { id: 2, title: "Financial Planning for Students", description: "A comprehensive guide to managing your finances.", link: "#" },
  ];

  return (
    <div style={{ paddingTop: '100px', color: 'white', maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Helpful Resources</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>Curated articles, tools, and guides to aid your scholarship journey.</p>
      
      {/* University Data Section */}
      <div className="glassmorphism-box" style={{ padding: '20px', marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>University Database</h2>
        <UniversityData />
      </div>

      {/* Existing Resources */}
      {resources.map(resource => (
        <div key={resource.id} className="glassmorphism-box" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: '0', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>{resource.title}</h3>
          <p style={{ lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{resource.description}</p>
          <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD1DC', textDecoration: 'underline' }}>Learn More</a>
        </div>
      ))}
      {/* Note: In the future, this data will come from a dedicated data file/source. */}
    </div>
  );
};

export default ResourcesPage 