import React from 'react';
import './AdmissionTab.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AdmissionTabProps {
  universityData: any;
}

const AdmissionTab: React.FC<AdmissionTabProps> = ({ universityData }) => {
  // Helper function to format percentage
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
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

  // Prepare data for acceptance rate pie chart
  const acceptanceRate = universityData.ADM_RATE || 0;
  const pieData = [
    { name: 'Accepted', value: acceptanceRate },
    { name: 'Not Accepted', value: 1 - acceptanceRate }
  ];

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
      {/* Admission Statistics Card */}
      <div className="admission-card">
        <h2>Admission Statistics</h2>
        <div className="admission-stats-grid">
          <div className="acceptance-rate-container">
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={45}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill="url(#gradientAccepted)" />
                    <Cell fill="#E8E8E8" />
                    <defs>
                      <linearGradient id="gradientAccepted" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#5C1F4A" />
                        <stop offset="50%" stopColor="#BA4A8F" />
                        <stop offset="100%" stopColor="#D483BA" />
                      </linearGradient>
                    </defs>
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="acceptance-rate-value">
                {formatPercentage(universityData.ADM_RATE)}
              </div>
            </div>
          </div>
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
        </div>
      </div>

      {/* Application Information Card */}
      <div className="admission-card">
        <h2>Application Information</h2>
        <p className="coming-soon-note">
          Detailed application requirements, deadlines, and other important information from Common App will be available soon.
        </p>
      </div>
    </div>
  );
};

export default AdmissionTab;