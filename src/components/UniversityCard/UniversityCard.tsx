import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './UniversityCard.css';

interface UniversityCardProps {
  university: {
    id: string | number;
    name: string;
    city: string;
    state: string;
    CONTROL?: string | number;
    HIGHDEG?: string | number;
    STUFACR?: string | number;
    LOCALE?: string | number;
    UGDS?: string | number;
    REGION?: string | number;
  };
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  const navigate = useNavigate();

  const handleViewProfile = useCallback(() => {
    const slug = String(university.id);
    navigate(`/university/${slug}`);
  }, [navigate, university.id]);

  const formatSchoolType = (control: string | number | undefined) => {
    if (!control) return 'N/A';
    switch (String(control)) {
      case '1': return 'Public';
      case '2': return 'Private Non-Profit';
      case '3': return 'Private For-Profit';
      default: return 'N/A';
    }
  };

  const formatHighestDegree = (degree: string | number | undefined) => {
    if (!degree) return 'N/A';
    switch (String(degree)) {
      case '0': return 'Non-degree';
      case '1': return 'Certificate';
      case '2': return 'Associate';
      case '3': return "Bachelor's";
      case '4': return 'Graduate';
      default: return 'N/A';
    }
  };

  const formatStudentFacultyRatio = (ratio: string | number | undefined) => {
    if (!ratio) return 'N/A';
    return `${Math.round(Number(ratio))}:1`;
  };

  const formatLocale = (locale: string | number | undefined) => {
    if (!locale) return 'N/A';
    switch (String(locale)) {
      case '11': return 'City: Large';
      case '12': return 'City: Midsize';
      case '13': return 'City: Small';
      case '21': return 'Suburb: Large';
      case '22': return 'Suburb: Midsize';
      case '23': return 'Suburb: Small';
      case '31': return 'Town: Fringe';
      case '32': return 'Town: Distant';
      case '33': return 'Town: Remote';
      case '41': return 'Rural: Fringe';
      case '42': return 'Rural: Distant';
      case '43': return 'Rural: Remote';
      default: return 'N/A';
    }
  };

  const formatSize = (size: string | number | undefined) => {
    if (!size) return 'N/A';
    const numSize = Number(size);
    if (numSize < 1000) return 'Very Small';
    if (numSize < 5000) return 'Small';
    if (numSize < 15000) return 'Medium';
    if (numSize < 30000) return 'Large';
    return 'Very Large';
  };

  const formatRegion = (region: string | number | undefined) => {
    if (!region) return 'N/A';
    switch (String(region)) {
      case '1': return 'New England';
      case '2': return 'Mid East';
      case '3': return 'Great Lakes';
      case '4': return 'Plains';
      case '5': return 'Southeast';
      case '6': return 'Southwest';
      case '7': return 'Rocky Mountains';
      case '8': return 'Far West';
      case '9': return 'Outlying Areas';
      default: return 'N/A';
    }
  };

  return (
    <div className="university-card glassmorphism-box">
      <div className="card-header">
        <h3 className="card-title">{university.name}</h3>
        <p className="card-location">{university.city}, {university.state}</p>
      </div>

      <hr className="card-divider" />

      <div className="card-metrics">
        <div className="metrics-row">
          <div className="metric-item">
            <span className="metric-label">School Type</span>
            <span className="metric-value">{formatSchoolType(university.CONTROL)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Highest Degree</span>
            <span className="metric-value">{formatHighestDegree(university.HIGHDEG)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Student-Faculty Ratio</span>
            <span className="metric-value">{formatStudentFacultyRatio(university.STUFACR)}</span>
          </div>
        </div>
        <div className="metrics-row">
          <div className="metric-item">
            <span className="metric-label">Setting</span>
            <span className="metric-value">{formatLocale(university.LOCALE)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Size</span>
            <span className="metric-value">{formatSize(university.UGDS)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Region</span>
            <span className="metric-value">{formatRegion(university.REGION)}</span>
          </div>
        </div>
      </div>

      <button className="btn-primary btn-small" onClick={handleViewProfile}>
        View Profile
      </button>
    </div>
  );
};

export default UniversityCard;