import React from 'react';
import './AdmissionTab.css';

interface AdmissionTabProps {
  universityData: any;
}

const AdmissionTab: React.FC<AdmissionTabProps> = ({ universityData }) => {
  // Helper function to format percentage
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) return 'Not Available';
    return `${Math.round(value * 100)}%`;
  };

  // Helper function to format SAT/ACT scores
  const formatScore = (value: number | undefined) => {
    if (value === undefined || value === null) return 'Not Available';
    return Math.round(value).toString();
  };

  // Helper function to format score ranges
  const formatScoreRange = (min: number | undefined, max: number | undefined) => {
    if (min === undefined || max === undefined) return 'Not Available';
    return `${Math.round(min)} - ${Math.round(max)}`;
  };

  // Debug log
  console.log('Admission Data:', {
    ADM_RATE: universityData.ADM_RATE,
    SAT_AVG: universityData.SAT_AVG,
    SATVR25: universityData.SATVR25,
    SATVR75: universityData.SATVR75,
    SATMT25: universityData.SATMT25,
    SATMT75: universityData.SATMT75,
    ACTCM25: universityData.ACTCM25,
    ACTCM75: universityData.ACTCM75,
    ACTEN25: universityData.ACTEN25,
    ACTEN75: universityData.ACTEN75,
    ACTMT25: universityData.ACTMT25,
    ACTMT75: universityData.ACTMT75
  });

  return (
    <div className="admission-container">
      {/* Admission Overview Card */}
      <div className="admission-card">
        <h2>Admission Overview</h2>
        <div className="info-grid">
          <div className="info-item">
            <h3>Acceptance Rate</h3>
            <p>{formatPercentage(universityData.ADM_RATE)}</p>
          </div>
          <div className="info-item">
            <h3>Average SAT Score</h3>
            <p>{formatScore(universityData.SAT_AVG)}</p>
          </div>
          <div className="info-item">
            <h3>Average ACT Score</h3>
            <p>{formatScore(universityData.ACTCMMID)}</p>
          </div>
        </div>
      </div>

      {/* SAT Scores Card */}
      <div className="admission-card">
        <h2>SAT Score Ranges</h2>
        <p className="score-note">Middle 50% of admitted students scored within these ranges</p>
        <div className="info-grid">
          <div className="info-item">
            <h3>SAT Reading</h3>
            <p>{formatScoreRange(universityData.SATVR25, universityData.SATVR75)}</p>
          </div>
          <div className="info-item">
            <h3>SAT Math</h3>
            <p>{formatScoreRange(universityData.SATMT25, universityData.SATMT75)}</p>
          </div>
        </div>
      </div>

      {/* ACT Scores Card */}
      <div className="admission-card">
        <h2>ACT Score Ranges</h2>
        <p className="score-note">Middle 50% of admitted students scored within these ranges</p>
        <div className="info-grid">
          <div className="info-item">
            <h3>ACT Composite</h3>
            <p>{formatScoreRange(universityData.ACTCM25, universityData.ACTCM75)}</p>
          </div>
          <div className="info-item">
            <h3>ACT English</h3>
            <p>{formatScoreRange(universityData.ACTEN25, universityData.ACTEN75)}</p>
          </div>
          <div className="info-item">
            <h3>ACT Math</h3>
            <p>{formatScoreRange(universityData.ACTMT25, universityData.ACTMT75)}</p>
          </div>
        </div>
      </div>

      {/* Additional Information Card */}
      <div className="admission-card">
        <h2>Additional Information</h2>
        <p>Detailed admission requirements, application deadlines, and other important information will be displayed here soon.</p>
      </div>
    </div>
  );
};

export default AdmissionTab; 