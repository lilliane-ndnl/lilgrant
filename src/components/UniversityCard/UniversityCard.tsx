import React from 'react';
import './UniversityCard.css';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercentage } from '../../utils/universityDataHelper';

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
    type?: string;
    size?: string;
  };
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  return (
    <Link to={`/university/${university.id}`} className="university-card">
      <h3 className="card-title">{university.name}</h3>
      <div className="tag-container">
        <span className="card-location">
          {university.city}, {university.state}
        </span>
        {university.type && <span className="info-tag">{university.type}</span>}
        {university.size && <span className="info-tag">{university.size}</span>}
      </div>
      
      <div className="card-info">
        <div className="info-row">
          <span className="info-label">Acceptance Rate</span>
          <span className="info-value">{university.ADM_RATE ? formatPercentage(university.ADM_RATE) : 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Average Annual Cost</span>
          <span className="info-value">{university.COSTT4_A ? formatCurrency(university.COSTT4_A) : 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Median Earnings</span>
          <span className="info-value">{university.MD_EARN_WNE_P10 ? formatCurrency(university.MD_EARN_WNE_P10) : 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">School Size</span>
          <span className="info-value">{university.UGDS ? `${university.UGDS.toLocaleString()} students` : 'N/A'}</span>
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard; 