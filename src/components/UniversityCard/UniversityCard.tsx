import React from 'react';
import './UniversityCard.css';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercentage } from '../../utils/universityDataHelper';

interface UniversityCardProps {
  university: {
    id: string | number;
    name: string;
    city: string;
    state: string;
    ADM_RATE?: string | number;
    COSTT4_A?: string | number;
    MD_EARN_WNE_P10?: string | number;
    UGDS?: string | number;
    CONTROL?: string | number;
    LOCALE?: string | number;
  };
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  // Convert string values to numbers where needed
  const admRate = university.ADM_RATE ? Number(university.ADM_RATE) : undefined;
  const cost = university.COSTT4_A ? Number(university.COSTT4_A) : undefined;
  const earnings = university.MD_EARN_WNE_P10 ? Number(university.MD_EARN_WNE_P10) : undefined;
  const enrollment = university.UGDS ? Number(university.UGDS) : undefined;

  return (
    <Link to={`/university/${university.id}`} className="university-card">
      <h3 className="card-title">{university.name}</h3>
      <div className="tag-container">
        <span className="card-location">
          {university.city}, {university.state}
        </span>
      </div>
      
      <div className="card-info">
        <div className="info-row">
          <span className="info-label">Acceptance Rate</span>
          <span className="info-value">{admRate ? formatPercentage(admRate) : 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Average Annual Cost</span>
          <span className="info-value">{cost ? formatCurrency(cost) : 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Median Earnings</span>
          <span className="info-value">{earnings ? formatCurrency(earnings) : 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">School Size</span>
          <span className="info-value">{enrollment ? `${enrollment.toLocaleString()} students` : 'N/A'}</span>
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard; 