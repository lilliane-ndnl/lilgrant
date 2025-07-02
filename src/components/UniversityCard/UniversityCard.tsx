import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './UniversityCard.css';
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
  const navigate = useNavigate();

  const handleViewProfile = useCallback(() => {
    const slug = String(university.id);
    navigate(`/university/${slug}`);
  }, [navigate, university.id]);

  // Convert string values to numbers where needed
  const admRate = university.ADM_RATE ? Number(university.ADM_RATE) : undefined;
  const cost = university.COSTT4_A ? Number(university.COSTT4_A) : undefined;
  const earnings = university.MD_EARN_WNE_P10 ? Number(university.MD_EARN_WNE_P10) : undefined;
  const enrollment = university.UGDS ? Number(university.UGDS) : undefined;

  return (
    <div className="university-card glassmorphism-box">
      <div className="card-header">
        <h3 className="card-title">{university.name}</h3>
        <p className="card-location">{university.city}, {university.state}</p>
      </div>

      <hr className="card-divider" />

      <div className="card-metrics">
        <div className="metric-row">
          <span>Acceptance Rate</span>
          <span>{admRate ? formatPercentage(admRate) : 'N/A'}</span>
        </div>
        <div className="metric-row">
          <span>Average Annual Cost</span>
          <span>{cost ? formatCurrency(cost) : 'N/A'}</span>
        </div>
        <div className="metric-row">
          <span>Median Earnings</span>
          <span>{earnings ? formatCurrency(earnings) : 'N/A'}</span>
        </div>
        <div className="metric-row">
          <span>School Size</span>
          <span>{enrollment ? `${enrollment.toLocaleString()} students` : 'N/A'}</span>
        </div>
      </div>

      <button className="btn-primary btn-small" onClick={handleViewProfile}>
        View Profile
      </button>
    </div>
  );
};

export default UniversityCard; 