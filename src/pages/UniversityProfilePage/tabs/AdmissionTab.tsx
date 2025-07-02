import React from 'react';
import './AdmissionTab.css';
import { formatTestRequirement } from '../../../utils/universityDataHelper';

interface AdmissionData {
  SAT_AVG: number | null;
  SAT_AVG_25: number | null;
  SAT_AVG_75: number | null;
  SATVR25: number | null;
  SATVR75: number | null;
  SATMT25: number | null;
  SATMT75: number | null;
  ACTCM25: number | null;
  ACTCM75: number | null;
  ACTCMMID: number | null;
  ACTEN25: number | null;
  ACTEN75: number | null;
  ACTMT25: number | null;
  ACTMT75: number | null;
  ADM_RATE: number | null;
  UGDS: number | null;
  INSTNM: string;
  ADMCON7: string;
  commonAppInfo?: {
    applicationFee?: string;
    applicationDeadline?: string;
    applicationDeadlines?: {
      regular?: string;
      early?: string;
      priority?: string;
      rolling?: string;
      earlyDecision?: string;
      earlyAction?: string;
      earlyDecision2?: string;
      earlyAction2?: string;
    };
    earlyDecision?: boolean;
    earlyAction?: boolean;
    commonApp?: boolean;
    requirements?: {
      essays?: boolean;
      interview?: boolean;
      recommendations?: boolean;
      satOrAct?: boolean;
      satSubject?: boolean;
      portfolio?: boolean;
      audition?: boolean;
      internationalStudents?: {
        toefl?: boolean;
        ielts?: boolean;
        financialAid?: boolean;
      };
    };
  };
  APPLURL?: string;
}

interface AdmissionTabProps {
  universityData: AdmissionData;
}

const AdmissionTab: React.FC<AdmissionTabProps> = ({ universityData }) => {
  // Helper function to format acceptance rate
  const formatAcceptanceRate = (rate: number | null) => {
    if (rate === null || isNaN(rate)) return 'Not Available';
    return `${(rate * 100).toFixed(1)}%`;
  };

  // Helper function to format test scores
  const formatScore = (score: number | null): string => {
    return score !== null ? score.toString() : 'N/A';
  };

  // Helper function to format test scores
  const formatScoreRange = (min: number | null, max: number | null) => {
    if (min === null || max === null || isNaN(min) || isNaN(max)) return 'Not Available';
    return `${Math.round(min)} - ${Math.round(max)}`;
  };

  // Helper function to format application fees
  const formatFee = (fee: string | undefined) => {
    if (!fee || fee === '0') return 'No Fee';
    if (fee === 'See Website') return 'See School Website';
    return `$${fee}`;
  };

  // Helper function to format test policy
  const formatTestPolicy = (policy: string) => {
    const policyMap: { [key: string]: string } = {
      'A': 'Always Required',
      'F': 'Test Flexible',
      'I': 'Tests Ignored',
      'N': 'Never Required',
      'S': 'Sometimes Required',
    };
    return policyMap[policy] || policy;
  };

  // Helper function to format requirements
  const formatRequirement = (value: boolean | undefined) => {
    if (value === undefined) return 'Not Available';
    return value ? 'Required' : 'Not Required';
  };

  // Custom pie chart component
  const AcceptanceRatePieChart: React.FC<{ value: number | null }> = ({ value }) => {
    const percentage = value !== null ? value * 100 : 0;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;
    
    return (
      <div className="pie-chart-container">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="none"
            stroke="#E8E8E8"
            strokeWidth="12"
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
            cx="80"
            cy="80"
            r="60"
            fill="none"
            stroke="url(#gradientAccepted)"
            strokeWidth="12"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={circumference * 0.25} // Start from top
            transform="rotate(-90 80 80)" // Rotate to start from top
          />
        </svg>
        <div className="acceptance-rate-value">
          {formatAcceptanceRate(value)}
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

  // Function to render score range bar
  const renderScoreRangeBar = (min: number | null, max: number | null, fullRange: [number, number], label: string) => {
    if (min === null || max === null) return null;
    
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

  const totalEnrollment = universityData.UGDS ? Math.round(universityData.UGDS).toLocaleString() : 'N/A';

  // Application Requirements Section
  const renderApplicationRequirements = () => {
    return (
      <div className="requirements-section">
        <h3>Application Requirements</h3>
        <div className="requirements-grid">
          <div className="requirement-item">
            <span className="requirement-label">Application Fee</span>
            <span className="requirement-value">
              {universityData.commonAppInfo?.applicationFee || 'Contact school'}
            </span>
          </div>
          
          <div className="requirement-item">
            <span className="requirement-label">Regular Decision Deadline</span>
            <span className="requirement-value">
              {universityData.commonAppInfo?.applicationDeadline || 'Contact school'}
            </span>
          </div>

          <div className="requirement-item">
            <span className="requirement-label">Early Decision</span>
            <span className="requirement-value">
              {universityData.commonAppInfo?.earlyDecision ? 'Available' : 'Not Available'}
            </span>
          </div>

          <div className="requirement-item">
            <span className="requirement-label">Early Action</span>
            <span className="requirement-value">
              {universityData.commonAppInfo?.earlyAction ? 'Available' : 'Not Available'}
            </span>
          </div>

          <div className="requirement-item">
            <span className="requirement-label">Common App</span>
            <span className="requirement-value">
              {universityData.commonAppInfo?.commonApp ? 'Accepted' : 'Not Accepted'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Testing Requirements Section
  const renderTestingRequirements = () => {
    const requirements = universityData.commonAppInfo?.requirements;
    
    return (
      <div className="requirements-section">
        <h3>Testing Requirements</h3>
        <div className="requirements-grid">
          <div className="requirement-item">
            <span className="requirement-label">SAT/ACT</span>
            <span className="requirement-value">
              {requirements?.satOrAct ? 'Required' : 'Not Required'}
            </span>
          </div>
          
          {requirements?.satSubject !== undefined && (
            <div className="requirement-item">
              <span className="requirement-label">SAT Subject Tests</span>
              <span className="requirement-value">
                {requirements.satSubject ? 'Required' : 'Not Required'}
              </span>
            </div>
          )}
          
          {requirements?.internationalStudents && (
            <>
              {requirements.internationalStudents.toefl !== undefined && (
                <div className="requirement-item">
                  <span className="requirement-label">TOEFL</span>
                  <span className="requirement-value">
                    {requirements.internationalStudents.toefl ? 'Required' : 'Not Required'}
                  </span>
                </div>
              )}
              
              {requirements.internationalStudents.ielts !== undefined && (
                <div className="requirement-item">
                  <span className="requirement-label">IELTS</span>
                  <span className="requirement-value">
                    {requirements.internationalStudents.ielts ? 'Required' : 'Not Required'}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Recommendations Section
  const renderRecommendations = () => {
    const requirements = universityData.commonAppInfo?.requirements;
    
    return (
      <div className="requirements-section">
        <h3>Additional Requirements</h3>
        <div className="requirements-grid">
          {requirements?.essays !== undefined && (
            <div className="requirement-item">
              <span className="requirement-label">Essays</span>
              <span className="requirement-value">
                {requirements.essays ? 'Required' : 'Not Required'}
              </span>
            </div>
          )}
          
          {requirements?.recommendations !== undefined && (
            <div className="requirement-item">
              <span className="requirement-label">Recommendations</span>
              <span className="requirement-value">
                {requirements.recommendations ? 'Required' : 'Not Required'}
              </span>
            </div>
          )}
          
          {requirements?.interview !== undefined && (
            <div className="requirement-item">
              <span className="requirement-label">Interview</span>
              <span className="requirement-value">
                {requirements.interview ? 'Required' : 'Not Required'}
              </span>
            </div>
          )}
          
          {requirements?.portfolio !== undefined && (
            <div className="requirement-item">
              <span className="requirement-label">Portfolio</span>
              <span className="requirement-value">
                {requirements.portfolio ? 'Required' : 'Not Required'}
              </span>
            </div>
          )}
          
          {requirements?.audition !== undefined && (
            <div className="requirement-item">
              <span className="requirement-label">Audition</span>
              <span className="requirement-value">
                {requirements.audition ? 'Required' : 'Not Required'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Application Fees Section
  const renderApplicationFees = () => {
    return (
      <div className="requirements-section">
        <h3>Application Fees</h3>
        <div className="requirements-grid">
          <div className="requirement-item">
            <span className="requirement-label">Application Fee</span>
            <span className="requirement-value">
              {universityData.commonAppInfo?.applicationFee || 'Contact school'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admission-container">
      {/* Card 1: Admission Statistics */}
      <div className="admission-card">
        <h2>Admission Statistics</h2>
        <div className="admission-stats-grid">
          {/* Left Column: Acceptance Rate Donut Chart */}
          <div className="acceptance-rate-container">
            <AcceptanceRatePieChart value={universityData.ADM_RATE} />
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

      {/* Card 2: Application Requirements */}
      <div className="admission-card">
        <h2>Application Requirements</h2>
        {renderApplicationRequirements()}
        {renderTestingRequirements()}
        {renderRecommendations()}
        {renderApplicationFees()}
      </div>

      {/* Card 3: Total Enrollment */}
      <div className="admission-card">
        <h2>Total Enrollment</h2>
        <div className="enrollment-display">
          <span className="enrollment-value">{totalEnrollment}</span>
          <span className="enrollment-label">Undergraduate Students</span>
        </div>
      </div>
    </div>
  );
};

export default AdmissionTab;