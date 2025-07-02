import React from 'react';
import { Link } from 'react-router-dom';
import './UniversityCard.css';

interface UniversityCardProps {
  university: {
    id: string;
    name: string;
    city: string;
    state: string;
    ADM_RATE?: number;
    COSTT4_A?: number;
    MD_EARN_WNE_P10?: number;
    UGDS?: number;
  };
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  const formatPercentage = (value?: number) => {
    if (!value) return 'N/A';
    return `${(value * 100).toFixed(0)}%`;
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return `$${Math.round(value / 1000)}k`;
  };

  const formatNumber = (value?: number) => {
    if (!value) return 'N/A';
    return value.toLocaleString();
  };

  return (
    <Link to={`/university/${university.id}`} className="university-card">
      <h3 className="card-title">{university.name}</h3>
      
      <div className="card-tags">
        <span className="card-location">
          {university.city}, {university.state}
        </span>
      </div>

      <div className="card-info">
        <div className="info-item">
          <span className="info-label">Acceptance Rate</span>
          <span className="info-value">{formatPercentage(university.ADM_RATE)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Average Annual Cost</span>
          <span className="info-value">{formatCurrency(university.COSTT4_A)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Median Earnings</span>
          <span className="info-value">{formatCurrency(university.MD_EARN_WNE_P10)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">School Size</span>
          <span className="info-value">{formatNumber(university.UGDS)} students</span>
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard; 