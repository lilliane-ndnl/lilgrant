import React from 'react';
import './AdmissionTab.css';
import { formatTestRequirement } from '../../../utils/universityDataHelper';

interface AdmissionTabProps {
  universityData: any;
}

const AdmissionTab: React.FC<AdmissionTabProps> = ({ universityData }) => {
  // Helper function to format percentage
  const formatAcceptanceRate = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    return `${Math.round(value * 100)}%`;
  };

  // Custom pie chart component
  const AcceptanceRatePieChart: React.FC<{ value: number }> = ({ value }) => {
    const percentage = value * 100;
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;
    
    return (
      <div className="pie-chart-container">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#E8E8E8"
            strokeWidth="10"
          />
          {/* Progress circle with gradient */}
          <defs>
            <linearGradient id="gradientAccepted" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5C1F4A" />
              <stop offset="50%" stopColor="#BA4A8F" />
              <stop offset="100%" stopColor="#D483BA" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#gradientAccepted)"
            strokeWidth="10"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={circumference * 0.25} // Start from top
            transform="rotate(-90 60 60)" // Rotate to start from top
          />
        </svg>
        <div className="acceptance-rate-value">
          {formatAcceptanceRate(value)}
        </div>
      </div>
    );
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

  // Function to render score range bar
  const renderScoreRangeBar = (min: number, max: number, fullRange: [number, number], label: string) => {
    const width = ((max - min) / (fullRange[1] - fullRange[0])) * 100;
    const left = ((min - fullRange[0]) / (fullRange[1] - fullRange[0])) * 100;
    
    return (
      <div className="score-range-container">
        <h3>{label}</h3>
        <div className="score-range-bar">
          <div className="score-range-full" />
          <div 
            className="score-range-actual" 
            style={{ 
              width: `${width}%`, 
              left: `${left}%`,
              background: 'linear-gradient(120deg, #5C1F4A, #BA4A8F, #D483BA)'
            }} 
          >
            <span className="score-min">{min}</span>
            <span className="score-max">{max}</span>
          </div>
        </div>
      </div>
    );
  };

  // Generate summary text
  const acceptanceRate = formatAcceptanceRate(universityData.ADM_RATE);
  const testingPolicy = formatTestRequirement(universityData.ADMCON7).toLowerCase();
  let testingPolicyPhrase = 'requires the submission of SAT/ACT scores as a key part of the application';

  if (testingPolicy === 'recommended') {
    testingPolicyPhrase = 'recommends submitting SAT/ACT scores to strengthen your application';
  } else if (testingPolicy === 'considered but not required') {
    testingPolicyPhrase = 'considers SAT/ACT scores if submitted, but does not require them';
  } else if (testingPolicy === 'neither required nor recommended') {
    testingPolicyPhrase = 'does not require or recommend SAT/ACT scores';
  }

  const summaryText = `${universityData.INSTNM} has an acceptance rate of ${acceptanceRate}. The university ${testingPolicyPhrase}. Students who were admitted and enrolled typically had admission test scores in the ranges shown above.`;

  return (
    <div className="admission-container">
      {/* Card 1: Admission Statistics */}
      <div className="admission-card">
        <h2>Admission Statistics</h2>
        <div className="admission-stats-grid">
          {/* Left Column: Acceptance Rate Donut Chart */}
          <div className="acceptance-rate-container">
            <AcceptanceRatePieChart value={universityData.ADM_RATE || 0} />
          </div>

          {/* Right Column: Test Score Range Bars */}
          <div className="test-scores-container">
            {universityData.SATVR25 && universityData.SATVR75 && (
              renderScoreRangeBar(
                universityData.SATVR25,
                universityData.SATVR75,
                [200, 800],
                'SAT Reading'
              )
            )}
            {universityData.SATMT25 && universityData.SATMT75 && (
              renderScoreRangeBar(
                universityData.SATMT25,
                universityData.SATMT75,
                [200, 800],
                'SAT Math'
              )
            )}
            {universityData.ACTCM25 && universityData.ACTCM75 && (
              renderScoreRangeBar(
                universityData.ACTCM25,
                universityData.ACTCM75,
                [1, 36],
                'ACT Composite'
              )
            )}
          </div>
          <p className="summary-text">{summaryText}</p>
        </div>
      </div>

      {/* Card 2: Application Information */}
      <div className="admission-card">
        <h2>Application Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Testing Policy</span>
            <span className="info-value">{formatTestRequirement(universityData.ADMCON7)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionTab;