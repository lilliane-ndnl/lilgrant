import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UniversityProfileTabs from '../../components/UniversityProfileTabs/UniversityProfileTabs';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import './UniversityProfilePage.css';

interface University {
  name: string;
  city?: string;
  state?: string;
  stateFull?: string;
  control?: string;
  region?: string;
  metroArea?: string;
  setting?: string;
  institutionSize?: string;
  gender?: string;
  hbcu?: string;
  primaryFocus?: string;
  undergraduate?: string;
  studentResidence?: string;
  religious?: string;
  budgetCategory?: string;
  tuitionFees?: string;
  roomBoard?: string;
  totalCost?: string;
  aidTypes?: string;
  numIntlAid?: string;
  pctIntlAid?: string;
  avgAidAmount?: string;
  avgCostAfterAid?: string;
  totalAwardedMillions?: string;
  meetsFullNeed?: string;
  largestMeritAmount?: string;
  largestMeritName?: string;
  costAfterMeritScholarship?: string;
  howToApply?: string;
  acceptanceRate?: string;
  intlAcceptanceRate?: string;
  yield?: string;
  intlYield?: string;
  class2027IntlApps?: string;
  class2027IntlAdmit?: string;
  class2027IntlEnroll?: string;
  rdAcceptanceRate?: string;
  earlyPlanOffered?: string;
  ed2Offered?: string;
  coaYear?: string;
  dataSource?: string;
  costAfterMerit?: string;
  notes?: string;
  officialLink?: string;
}

interface ScholarshipData {
  id: string;
  title: string;
  amount: string;
  awards: string;
  deadline: string;
  sponsors: string;
  description: string;
  eligibilityRequirements: string;
  studyLevel: string;
  fieldOfStudy: string;
  country: string;
  officialLink: string;
  additionalNotes: string;
}

const UniversityProfilePage: React.FC = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const [university, setUniversity] = useState<University | null>(null);
  const [relevantScholarships, setRelevantScholarships] = useState<ScholarshipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to create slug from university name (same as UniversityCard)
  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Function to find university by slug
  const findUniversityBySlug = (universities: University[], slug: string): University | null => {
    console.log('Searching for university with slug:', slug);
    
    // Try exact slug match first
    let foundUniversity = universities.find(u => createSlug(u.name) === slug);
    
    if (foundUniversity) {
      console.log('Found university by exact slug match:', foundUniversity.name);
      return foundUniversity;
    }
    
    // Try partial slug match (in case of URL encoding issues)
    foundUniversity = universities.find(u => {
      const universitySlug = createSlug(u.name);
      return universitySlug.includes(slug) || slug.includes(universitySlug);
    });
    
    if (foundUniversity) {
      console.log('Found university by partial slug match:', foundUniversity.name);
      return foundUniversity;
    }
    
    // Try direct name match (in case slug conversion failed)
    const decodedSlug = decodeURIComponent(slug);
    foundUniversity = universities.find(u => u.name.toLowerCase() === decodedSlug.toLowerCase());
    
    if (foundUniversity) {
      console.log('Found university by direct name match:', foundUniversity.name);
      return foundUniversity;
    }
    
    console.log('No university found for slug:', slug);
    return null;
  };

  // Function to calculate days until deadline
  const getDaysUntilDeadline = (deadline: string): number => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to calculate scholarship relevance score
  const calculateRelevanceScore = (scholarship: ScholarshipData, university: University): number => {
    let score = 0;
    
    // Country match (highest priority)
    if (scholarship.country.toLowerCase().includes('usa') || 
        scholarship.country.toLowerCase().includes('united states') ||
        scholarship.country === 'USA') {
      score += 100;
    }
    
    // Field of study match (if university has primary focus)
    if (university.primaryFocus && 
        scholarship.fieldOfStudy.toLowerCase().includes(university.primaryFocus.toLowerCase())) {
      score += 50;
    }
    
    // STEM field bonus (common in many universities)
    if (scholarship.fieldOfStudy.toLowerCase().includes('stem') ||
        scholarship.fieldOfStudy.toLowerCase().includes('science') ||
        scholarship.fieldOfStudy.toLowerCase().includes('technology') ||
        scholarship.fieldOfStudy.toLowerCase().includes('engineering') ||
        scholarship.fieldOfStudy.toLowerCase().includes('mathematics')) {
      score += 25;
    }
    
    // International student focus (if university has international data)
    if (university.intlAcceptanceRate && 
        (scholarship.country.toLowerCase().includes('global') || 
         scholarship.country.toLowerCase().includes('international'))) {
      score += 30;
    }
    
    // Deadline proximity (closer deadlines get higher scores)
    const daysUntilDeadline = getDaysUntilDeadline(scholarship.deadline);
    if (daysUntilDeadline > 0) {
      // Closer deadlines get higher scores (max 40 points for deadlines within 30 days)
      score += Math.max(0, 40 - daysUntilDeadline);
    }
    
    return score;
  };

  // Function to fetch and filter relevant scholarships
  const fetchRelevantScholarships = async (university: University) => {
    try {
      const response = await fetch('/data/scholarships.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch scholarships: ${response.status}`);
      }
      
      const allScholarships: ScholarshipData[] = await response.json();
      
      // Calculate relevance scores and sort
      const scoredScholarships = allScholarships
        .map(scholarship => ({
          ...scholarship,
          relevanceScore: calculateRelevanceScore(scholarship, university),
          daysUntilDeadline: getDaysUntilDeadline(scholarship.deadline)
        }))
        .filter(scholarship => scholarship.daysUntilDeadline > 0) // Only show scholarships with future deadlines
        .sort((a, b) => {
          // Sort by relevance score first, then by deadline proximity
          if (b.relevanceScore !== a.relevanceScore) {
            return b.relevanceScore - a.relevanceScore;
          }
          return a.daysUntilDeadline - b.daysUntilDeadline;
        })
        .slice(0, 6); // Take top 6 most relevant scholarships
      
      setRelevantScholarships(scoredScholarships);
    } catch (err) {
      console.error('Error fetching relevant scholarships:', err);
    }
  };

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        console.log('=== UNIVERSITY PROFILE PAGE DEBUG ===');
        console.log('Attempting to find profile for slug:', universityId);
        
        setLoading(true);
        setError(null);
        
        const response = await fetch('/data/university-data-final.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch university data: ${response.status} ${response.statusText}`);
        }
        
        const universities: University[] = await response.json();
        console.log(`Fetched ${universities.length} total universities.`);
        
        if (!universityId) {
          console.log('No university slug provided in URL');
          setError('No university specified');
          setLoading(false);
          return;
        }
        
        const foundUniversity = findUniversityBySlug(universities, universityId);
        console.log('Found university object:', foundUniversity);
        
        if (!foundUniversity) {
          console.log('University not found - setting error state');
          setError(`University not found for slug: ${universityId}`);
        } else {
          console.log('University found - setting university state');
          setUniversity(foundUniversity);
          // Fetch relevant scholarships for this university
          await fetchRelevantScholarships(foundUniversity);
        }
        
        console.log('Setting loading to false');
        setLoading(false);
        
      } catch (err) {
        console.error('CRITICAL: Failed to fetch or process data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [universityId]);

  // Function to format deadline display
  const formatDeadline = (deadline: string): string => {
    const daysUntilDeadline = getDaysUntilDeadline(deadline);
    if (daysUntilDeadline <= 0) return 'Deadline passed';
    if (daysUntilDeadline === 1) return 'Due tomorrow';
    if (daysUntilDeadline <= 7) return `Due in ${daysUntilDeadline} days`;
    if (daysUntilDeadline <= 30) return `Due in ${Math.ceil(daysUntilDeadline / 7)} weeks`;
    return `Due in ${Math.ceil(daysUntilDeadline / 30)} months`;
  };

  if (loading) {
    return (
      <div className="university-profile-page">
        <LoadingBar />
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="university-profile-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'University not found'}</p>
          <Link to="/universities" className="back-button">
            Back to University Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="university-profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <div className="header-content">
          <Link to="/universities" className="back-link">
            ← Back to University Hub
          </Link>
          <h1 className="university-name">{university.name}</h1>
          <p className="university-location">
            {university.city}, {university.stateFull}
          </p>
        </div>
      </div>

      {/* Key Stats Bar */}
      <div className="key-stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-label">Acceptance Rate</div>
            <div className="stat-value">{university.acceptanceRate || 'N/A'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Tuition & Fees</div>
            <div className="stat-value">{university.tuitionFees || 'N/A'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">International Aid</div>
            <div className="stat-value">{university.pctIntlAid || 'N/A'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Avg Cost After Aid</div>
            <div className="stat-value">{university.avgCostAfterAid || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="profile-content">
        <UniversityProfileTabs university={university} />
      </div>

      {/* Relevant Scholarships Section */}
      <div className="relevant-scholarships-section">
        <h2>Relevant Scholarships</h2>
        <div className="scholarships-categories-row">
          {relevantScholarships.length > 0 ? (
            relevantScholarships.map((scholarship) => (
              <div key={scholarship.id} className="scholarship-category-card">
                <h3>{scholarship.title}</h3>
                <div className="scholarship-details">
                  <p className="scholarship-amount">{scholarship.amount}</p>
                  <p className="scholarship-deadline">{formatDeadline(scholarship.deadline)}</p>
                  <p className="scholarship-field">{scholarship.fieldOfStudy}</p>
                </div>
                <Link to={`/scholarships`} className="scholarship-category-btn">
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="no-scholarships-message">
              <p>No relevant scholarships found at the moment.</p>
              <Link to="/scholarships" className="scholarship-category-btn">
                Browse All Scholarships
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityProfilePage; 