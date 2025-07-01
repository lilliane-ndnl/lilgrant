import React from 'react';
import './AdmissionTab.css';
import DonutChart from '../../../components/DonutChart/DonutChart';
import ScoreRangeBar from '../../../components/ScoreRangeBar/ScoreRangeBar';

interface AdmissionTabProps {
  universityData: any;
}

const AdmissionTab: React.FC<AdmissionTabProps> = ({ universityData }) => {
  // Helper function to check if we have valid range data
  const hasValidRange = (low: number | undefined, high: number | undefined) => {
    return typeof low === 'number' && typeof high === 'number' && !isNaN(low) && !isNaN(high);
  };

  return (
    <div className="admission-container">
      <div className="admission-card">
        <h2>Admission Statistics</h2>
        <div className="admission-grid">
          {/* Left Column - Acceptance Rate */}
          <div className="acceptance-rate-section">
            {universityData.ADM_RATE ? (
              <DonutChart
                value={universityData.ADM_RATE}
                label="Acceptance Rate"
                size={240}
              />
            ) : (
              <div className="no-data">Acceptance rate not available</div>
            )}
          </div>

          {/* Right Column - Test Scores */}
          <div className="test-scores-section">
            <h3>Test Score Ranges</h3>
            
            {/* SAT Reading */}
            {hasValidRange(universityData.SATVR25, universityData.SATVR75) && (
              <ScoreRangeBar
                min={200}
                max={800}
                lowValue={universityData.SATVR25}
                highValue={universityData.SATVR75}
                label="SAT Reading/Writing"
              />
            )}

            {/* SAT Math */}
            {hasValidRange(universityData.SATMT25, universityData.SATMT75) && (
              <ScoreRangeBar
                min={200}
                max={800}
                lowValue={universityData.SATMT25}
                highValue={universityData.SATMT75}
                label="SAT Math"
              />
            )}

            {/* ACT Composite */}
            {hasValidRange(universityData.ACTCM25, universityData.ACTCM75) && (
              <ScoreRangeBar
                min={1}
                max={36}
                lowValue={universityData.ACTCM25}
                highValue={universityData.ACTCM75}
                label="ACT Composite"
              />
            )}

            {/* ACT English */}
            {hasValidRange(universityData.ACTEN25, universityData.ACTEN75) && (
              <ScoreRangeBar
                min={1}
                max={36}
                lowValue={universityData.ACTEN25}
                highValue={universityData.ACTEN75}
                label="ACT English"
              />
            )}

            {/* ACT Math */}
            {hasValidRange(universityData.ACTMT25, universityData.ACTMT75) && (
              <ScoreRangeBar
                min={1}
                max={36}
                lowValue={universityData.ACTMT25}
                highValue={universityData.ACTMT75}
                label="ACT Math"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionTab; 