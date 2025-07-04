import React from 'react';
import './HomePage.css';
import HeroSection from '../../components/HeroSection/HeroSection';
import FloatingCard3D from '../../components/FloatingCard3D/FloatingCard3D';
import DStar3D from '../../components/Showcase3DIcons/3DStar';
import DBookStack3D from '../../components/Showcase3DIcons/3DBookStack';
import DBuilding3D from '../../components/Showcase3DIcons/3DBuilding';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <HeroSection />
      {/* 3D Cards Showcase */}
      <section className="floating-cards-showcase">
        <div className="floating-cards-grid">
          <FloatingCard3D>
            <div className="showcase-card">
              <DStar3D />
              <h3>Scholarship Discovery</h3>
              <p>Access our growing hand-picked database of 400+ scholarship opportunities. We focus on finding and detailing financial aid options available to international students to help you fund your education.</p>
              <div className="card-stats">
                <div className="stat">
                  <span className="stat-number">400+</span>
                  <span className="stat-label">Scholarships</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Countries</span>
                </div>
              </div>
            </div>
          </FloatingCard3D>

          <FloatingCard3D perspective={1200} maxRotation={20}>
            <div className="showcase-card">
              <DBuilding3D />
              <h3>University Hub</h3>
              <p>Explore more than 4,000 U.S. institutions. Our database is specifically curated to provide international students with the detailed insights on academics, cost, and career outcomes needed to find the perfect fit.</p>
              <div className="card-stats">
                <div className="stat">
                  <span className="stat-number">4000+</span>
                  <span className="stat-label">Schools</span>
                </div>
                <div className="stat">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Programs</span>
                </div>
              </div>
            </div>
          </FloatingCard3D>

          <FloatingCard3D perspective={1500} glareIntensity={0.7}>
            <div className="showcase-card">
              <DBookStack3D />
              <h3>Guidance & Resources</h3>
              <p>From application checklists to tips for navigating student life in the U.S. — including dorm shopping, budgeting, and career advice — our resources are here to support you at every step.</p>
              <div className="card-stats">
                <div className="stat">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Resources</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
            </div>
          </FloatingCard3D>
        </div>
      </section>
      {/* ... existing content ... */}
    </div>
  );
};

export default HomePage; 