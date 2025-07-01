import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import './UniversityProfilePage.css';
import { formatFullStateName } from '../../utils/universityDataHelper';

interface University {
  id: string;
  INSTNM: string;
  CITY?: string;
  STABBR?: string;
  CONTROL?: string;
  LOCALE?: string;
  CCSIZSET?: string;
  HIGHDEG?: string;
  ADM_RATE?: string;
  SATVR25?: string;
  SATVR75?: string;
  SATMT25?: string;
  SATMT75?: string;
  ACTCM25?: string;
  ACTCM75?: string;
  NPT41_PUB?: string;
  NPT41_PRIV?: string;
  NPT42_PUB?: string;
  NPT42_PRIV?: string;
  NPT43_PUB?: string;
  NPT43_PRIV?: string;
  NPT44_PUB?: string;
  NPT44_PRIV?: string;
  NPT45_PUB?: string;
  NPT45_PRIV?: string;
  PCIP14?: string;
  PCIP52?: string;
  PCIP51?: string;
  PCIP45?: string;
  PCIP11?: string;
  C150_4_POOLED?: string;
  RET_FT4?: string;
  MD_EARN_WNE_P10?: string;
  GT_25K_P6?: string;
  UGDS_WHITE?: string;
  UGDS_BLACK?: string;
  UGDS_HISP?: string;
  UGDS_ASIAN?: string;
  UGDS_NRA?: string;
  UGDS_2MOR?: string;
  officialLink?: string;
}

const UniversityProfilePage: React.FC = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const [universityData, setUniversityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!universityId) {
        setError('No university ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // First try to fetch from the details directory
        let response = await fetch(`/data/details/${universityId}.json`);
        
        // If that fails, try fetching from university-data-final.json
        if (!response.ok) {
          const allUniversitiesResponse = await fetch('/data/university-data-final.json');
          if (!allUniversitiesResponse.ok) {
            throw new Error(`Failed to load university data (Status: ${allUniversitiesResponse.status})`);
          }
          const allUniversities = await allUniversitiesResponse.json();
          const university = allUniversities.find((u: any) => u.id === universityId);
          if (!university) {
            throw new Error('University not found');
          }
          setUniversityData(university);
        } else {
          const data = await response.json();
          if (!data || typeof data !== 'object') {
            throw new Error('Invalid university data received');
          }
          setUniversityData(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load university data');
        console.error('Error loading university data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [universityId]);

  const formatAcceptanceRate = (rate: string | undefined) => {
    if (!rate || rate === 'NA') return 'Not Available';
    return `${(parseFloat(rate) * 100).toFixed(0)}%`;
  };

  const formatGraduationRate = (rate: string | undefined) => {
    if (!rate || rate === 'NA') return 'Not Available';
    return `${(parseFloat(rate) * 100).toFixed(0)}%`;
  };

  const getAverageAnnualCost = (pubCost: string | undefined, privCost: string | undefined) => {
    const cost = pubCost !== 'NA' ? pubCost : privCost;
    if (!cost || cost === 'NA') return 'Not Available';
    return `$${parseInt(cost).toLocaleString()}k`;
  };

  const formatMedianEarnings = (earnings: string | undefined) => {
    if (!earnings || earnings === 'NA') return 'Not Available';
    return `$${parseInt(earnings).toLocaleString()}k`;
  };

  const formatSchoolType = (control: string | undefined) => {
    if (!control) return 'Not Available';
    switch (control) {
      case '1': return 'Public';
      case '2': return 'Private nonprofit';
      case '3': return 'Private for-profit';
      default: return 'Not Available';
    }
  };

  const formatLocale = (locale: string | undefined) => {
    if (!locale) return 'Not Available';
    const firstTwoDigits = locale.substring(0, 2);
    switch (firstTwoDigits) {
      case '11':
      case '12':
      case '13':
        return 'City';
      case '21':
      case '22':
      case '23':
        return 'Suburb';
      case '31':
      case '32':
      case '33':
        return 'Town';
      case '41':
      case '42':
      case '43':
        return 'Rural';
      default:
        return 'Not Available';
    }
  };

  const formatSize = (sizeset: string | undefined) => {
    if (!sizeset || sizeset === 'NA') return 'Not Available';
    
    switch (sizeset) {
      case '1':
      case '2':
      case '6':
      case '7':
        return 'Small';
      case '3':
      case '8':
        return 'Medium';
      case '4':
      case '9':
        return 'Large';
      default:
        return 'Not Available';
    }
  };

  const formatCurrency = (value: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    if (value === null || value === undefined) return 'N/A';
    return `${(value * 100).toFixed(0)}%`;
  };

  const getAverageCost = () => {
    const isPublic = universityData.CONTROL === 1;
    const costField = isPublic ? 'NPT4_PUB' : 'NPT4_PRIV';
    return universityData[costField] || null;
  };

  // Add new helper functions for formatting data
  const formatHighestDegree = (degree: string | undefined) => {
    if (!degree) return 'Not Available';
    switch (degree) {
      case '0': return 'Non-degree-granting';
      case '1': return 'Certificate';
      case '2': return 'Associate degree';
      case '3': return 'Bachelor\'s degree';
      case '4': return 'Graduate degree';
      default: return 'Not Available';
    }
  };

  const formatNetPrice = (pubPrice: string | undefined, privPrice: string | undefined) => {
    const price = pubPrice !== 'NA' ? pubPrice : privPrice;
    if (!price || price === 'NA') return 'Not Available';
    return formatCurrency(parseInt(price));
  };

  const formatProgramPercentage = (percentage: string | undefined) => {
    if (!percentage || percentage === 'NA') return 'Not Available';
    return `${(parseFloat(percentage) * 100).toFixed(1)}%`;
  };

  // Enhanced defensive rendering
  if (loading) {
    return (
      <div className="loading-container">
        <LoadingBar />
        <p>Loading university data...</p>
      </div>
    );
  }

  if (error || !universityData) {
    return (
        <div className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error || 'Failed to load university data'}</p>
        <Link to="/university-hub" className="back-button">
          Return to University Hub
          </Link>
        </div>
    );
  }

  // Verify essential data is present
  if (!universityData.INSTNM) {
    return (
      <div className="error-container">
        <h2>Invalid Data</h2>
        <p>The university data appears to be incomplete.</p>
        <Link to="/university-hub" className="back-button">
          Return to University Hub
        </Link>
      </div>
    );
  }

  // Safe to render the main content now
  return (
    <div className="university-profile-page">
      <div className="hero-header">
        <div className="hero-content">
          <div className="header-buttons">
            <Link to="/university-hub" className="back-link">
            ← Back to University Hub
          </Link>
            {universityData.INSTURL && (
              <a 
                href={universityData.INSTURL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="visit-website-btn"
              >
                Visit Website
              </a>
            )}
          </div>
          <h1>{universityData.INSTNM}</h1>
          <h2>
            {universityData.CITY && formatFullStateName(universityData.STABBR) 
              ? `${universityData.CITY}, ${formatFullStateName(universityData.STABBR)}`
              : 'Location not available'}
          </h2>
        </div>
      </div>

      <div className="key-stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-label">Acceptance Rate</div>
            <div className="stat-value">{formatPercentage(universityData.ADM_RATE)}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Graduation Rate</div>
            <div className="stat-value">{formatPercentage(universityData.C150_4_POOLED)}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Average Annual Cost</div>
            <div className="stat-value">{formatCurrency(getAverageCost())}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Median Earnings</div>
            <div className="stat-value">{formatCurrency(universityData.MD_EARN_WNE_P10)}</div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="content-body">
        {/* Left Column - Navigation */}
        <nav className="sidebar">
          {['Overview', 'Admissions', 'Cost & Financial Aid', 'Academics', 
            'Fields of Study', 'Graduation & Earnings', 'Diversity'].map((tab) => (
            <button
              key={tab.toLowerCase().replace(/\s+/g, '-')}
              className={`nav-link ${activeTab === tab.toLowerCase().replace(/\s+/g, '-') ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, '-'))}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Right Column - Content */}
        <div className="content-main">
          {activeTab === 'overview' && (
            <>
              <div className="content-card">
                <h2>At a Glance</h2>
                <div className="glance-grid">
                  <div className="glance-item">
                    <span className="label">School Type</span>
                    <span className="value">{formatSchoolType(universityData.CONTROL)}</span>
                  </div>
                  <div className="glance-item">
                    <span className="label">Setting</span>
                    <span className="value">{formatLocale(universityData.LOCALE)}</span>
                  </div>
                  <div className="glance-item">
                    <span className="label">Size</span>
                    <span className="value">{formatSize(universityData.CCSIZSET)}</span>
                  </div>
                  <div className="glance-item">
                    <span className="label">Highest Degree Awarded</span>
                    <span className="value">{formatHighestDegree(universityData.HIGHDEG)}</span>
                  </div>
                </div>
              </div>
              <div className="content-card">
                <h2>About this University</h2>
                <p>An AI-generated summary of this university's key strengths, programs, and campus culture will be displayed here soon.</p>
              </div>
            </>
          )}

          {activeTab === 'admissions' && (
            <div className="content-card">
              <h2>Admissions Data</h2>
              <div className="data-grid">
                <div className="data-item">
                  <span className="label">Acceptance Rate</span>
                  <span className="value">{formatAcceptanceRate(universityData.ADM_RATE)}</span>
                </div>
                <div className="data-item">
                  <span className="label">SAT Reading & Writing Range</span>
                  <span className="value">{universityData.SATVR25} - {universityData.SATVR75}</span>
                </div>
                <div className="data-item">
                  <span className="label">SAT Math Range</span>
                  <span className="value">{universityData.SATMT25} - {universityData.SATMT75}</span>
                </div>
                <div className="data-item">
                  <span className="label">ACT Composite Range</span>
                  <span className="value">{universityData.ACTCM25} - {universityData.ACTCM75}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cost-&-financial-aid' && (
            <>
              <div className="content-card">
                <h2>Average Annual Cost</h2>
                <div className="data-item">
                  <span className="value">{getAverageAnnualCost(universityData)}</span>
                </div>
              </div>
              <div className="content-card">
                <h2>Net Price by Household Income</h2>
                <div className="data-grid">
                  <div className="data-item">
                    <span className="label">$0-30,000</span>
                    <span className="value">{formatNetPrice(universityData.NPT41_PUB, universityData.NPT41_PRIV)}</span>
                  </div>
                  <div className="data-item">
                    <span className="label">$30,001-48,000</span>
                    <span className="value">{formatNetPrice(universityData.NPT42_PUB, universityData.NPT42_PRIV)}</span>
                  </div>
                  <div className="data-item">
                    <span className="label">$48,001-75,000</span>
                    <span className="value">{formatNetPrice(universityData.NPT43_PUB, universityData.NPT43_PRIV)}</span>
                  </div>
                  <div className="data-item">
                    <span className="label">$75,001-110,000</span>
                    <span className="value">{formatNetPrice(universityData.NPT44_PUB, universityData.NPT44_PRIV)}</span>
                  </div>
                  <div className="data-item">
                    <span className="label">$110,001+</span>
                    <span className="value">{formatNetPrice(universityData.NPT45_PUB, universityData.NPT45_PRIV)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'academics' && (
            <div className="content-card">
              <h2>Popular Programs</h2>
              <p>The following are the most popular fields of study by percentage of degrees awarded:</p>
              <div className="data-grid">
                <div className="data-item">
                  <span className="label">Engineering</span>
                  <span className="value">{formatProgramPercentage(universityData.PCIP14)}</span>
                </div>
                <div className="data-item">
                  <span className="label">Business & Marketing</span>
                  <span className="value">{formatProgramPercentage(universityData.PCIP52)}</span>
                </div>
                <div className="data-item">
                  <span className="label">Health Professions</span>
                  <span className="value">{formatProgramPercentage(universityData.PCIP51)}</span>
                </div>
                <div className="data-item">
                  <span className="label">Social Sciences</span>
                  <span className="value">{formatProgramPercentage(universityData.PCIP45)}</span>
                </div>
                <div className="data-item">
                  <span className="label">Computer Science</span>
                  <span className="value">{formatProgramPercentage(universityData.PCIP11)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fields-of-study' && (
            <div className="content-card">
              <h2>Field of Study Details</h2>
              <p>Detailed data on earnings and outcomes for specific fields of study will be implemented here.</p>
            </div>
          )}

          {activeTab === 'graduation-&-earnings' && (
            <>
              <div className="content-card">
                <h2>Student Outcomes</h2>
                <div className="data-grid">
                  <div className="data-item">
                    <span className="label">Graduation Rate (4-Year)</span>
                    <span className="value">{formatGraduationRate(universityData.C150_4_POOLED)}</span>
                  </div>
                  <div className="data-item">
                    <span className="label">Retention Rate (Full-time)</span>
                    <span className="value">{formatPercentage(universityData.RET_FT4)}</span>
                  </div>
                </div>
              </div>
              <div className="content-card">
                <h2>Financial Outcomes</h2>
                <div className="data-grid">
                  <div className="data-item">
                    <span className="label">Median Earnings (10 years after entry)</span>
                    <span className="value">{formatMedianEarnings(universityData.MD_EARN_WNE_P10)}</span>
                  </div>
                  <div className="data-item">
                    <span className="label">% Earning More Than a High School Graduate</span>
                    <span className="value">{formatPercentage(universityData.GT_25K_P6)}</span>
                  </div>
                </div>
      </div>
            </>
          )}

          {activeTab === 'diversity' && (
            <div className="content-card">
              <h2>Student Body Demographics</h2>
              <div className="data-grid">
                <div className="data-item">
                  <span className="label">White</span>
                  <span className="value">{formatPercentage(universityData.UGDS_WHITE)}</span>
                </div>
                <div className="data-item">
                  <span className="label">Black</span>
                  <span className="value">{formatPercentage(universityData.UGDS_BLACK)}</span>
                </div>
                <div className="data-item">
                  <span className="label">Hispanic</span>
                  <span className="value">{formatPercentage(universityData.UGDS_HISP)}</span>
                </div>
                <div className="data-item">
                  <span className="label">Asian</span>
                  <span className="value">{formatPercentage(universityData.UGDS_ASIAN)}</span>
                </div>
                <div className="data-item">
                  <span className="label">International Students</span>
                  <span className="value">{formatPercentage(universityData.UGDS_NRA)}</span>
                </div>
                <div className="data-item">
                  <span className="label">Two or More Races</span>
                  <span className="value">{formatPercentage(universityData.UGDS_2MOR)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityProfilePage; 