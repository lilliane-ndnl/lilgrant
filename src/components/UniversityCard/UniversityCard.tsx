import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  formatSchoolType,
  formatLocale,
  formatAcceptanceRate,
  getAverageAnnualCost,
  formatSizeCategory,
  formatSchoolSize,
  formatMedianEarnings
} from '../../utils/universityDataHelper';
import './UniversityCard.css';

export interface UniversityData {
  id: string | number;
  slug: string;
  name: string;
  city: string;
  state: string;
  CONTROL: string | number;
  LOCALE: string | number;
  ADM_RATE: string | number;
  NPT4_PUB: string | number;
  NPT4_PRIV: string | number;
  UGDS: string | number;
  MD_EARN_WNE_P10: string | number;
  [key: string]: any;
}

interface UniversityCardProps {
  university: UniversityData;
}

// SVG Icons as components
const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 2H9c-1.1 0-2 .9-2 2v6H5c-1.1 0-2 .9-2 2v10h18V4c0-1.1-.9-2-2-2zm0 18h-4v-6h-2v6H5v-8h14v8zM13 9V4h6v5h-6z"/>
  </svg>
);

const CityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const UniversityCard = React.memo(({ university }: UniversityCardProps) => {
  const navigate = useNavigate();

  const handleViewProfile = useCallback(() => {
    // Create a URL-friendly slug from the university name
    const slug = String(university.id);
    navigate(`/university/${slug}`);
  }, [navigate, university.id]);

  if (!university || !university.id || !university.name) {
    return null;
  }

  return (
    <div className="university-card glassmorphism-box">
      <div className="card-header">
        <h3 className="card-title">{university.name}</h3>
        <p className="card-location">{university.city}, {university.state}</p>
      </div>
      
      <hr className="card-divider" />
      
      <div className="card-icons">
        <div className="icon-item">
          <BuildingIcon />
          <span>{formatSchoolType(university.CONTROL)}</span>
        </div>
        <div className="icon-item">
          <CityIcon />
          <span>{formatLocale(university.LOCALE)}</span>
        </div>
        <div className="icon-item">
          <PeopleIcon />
          <span>{formatSizeCategory(university.UGDS)}</span>
        </div>
      </div>

      <div className="card-metrics">
        <div className="metric-row">
          <span>Acceptance Rate</span>
          <span>{formatAcceptanceRate(university.ADM_RATE)}</span>
        </div>
        <div className="metric-row">
          <span>Average Annual Cost</span>
          <span>{getAverageAnnualCost(university)}</span>
        </div>
        <div className="metric-row">
          <span>Median Earnings</span>
          <span>{formatMedianEarnings(university.MD_EARN_WNE_P10)}</span>
        </div>
        <div className="metric-row">
          <span>School Size</span>
          <span>{formatSchoolSize(university.UGDS)}</span>
        </div>
      </div>

      <button className="btn-primary btn-small" onClick={handleViewProfile}>
        View Profile
      </button>
    </div>
  );
});

UniversityCard.displayName = 'UniversityCard';
export default UniversityCard; 