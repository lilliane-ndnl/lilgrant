import React from 'react';
import './AdmissionTab.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

  // Prepare data for acceptance rate pie chart
  const acceptanceRate = universityData.ADM_RATE || 0;
  const pieData = [
    { name: 'Accepted', value: acceptanceRate },
    { name: 'Not Accepted', value: 1 - acceptanceRate }
  ];
  const COLORS = ['#4CAF50', '#f5f5f5'];

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
              left: `${left}%` 
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
            <h3>Acceptance Rate</h3>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    fill="#8884d8"
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="acceptance-rate-label">
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