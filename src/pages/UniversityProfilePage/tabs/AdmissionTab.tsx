import React from 'react';
import './AdmissionTab.css';
import { formatTestRequirement, getCompetitiveness, getTestingPolicyPhrase } from '../../../utils/universityDataHelper';
import { formatDate } from '../../../utils/dateFormatter';

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
  ADMCON1?: string;
  ADMCON2?: string;
  ADMCON3?: string;
  ADMCON4?: string;
  ADMCON5?: string;
  ADMCON6?: string;
  ADMCON7: string;
  ADMCON8?: string;
  ADMCON9?: string;
  APPLURL?: string;
  commonAppInfo?: {
    acceptsCommonApp: boolean;
    applicationDeadlines: {
      earlyDecision: string | null;
      earlyDecision2: string | null;
      earlyAction: string | null;
      earlyAction2: string | null;
      restrictiveEarlyAction: string | null;
      regular: string | null;
    };
    applicationFees: {
      domestic: string;
      international: string;
    };
    requirements: {
      personalEssayRequired: boolean;
      writingSupplement: boolean;
      coursesAndGrades: boolean;
      portfolio: string | null;
      testPolicy: string;
      testScoresUsed: string | null;
      internationalRequirements: string | null;
    };
    recommendations: {
      teacherEvals: string;
      otherEvals: string;
      counselorRecommendation: boolean;
      midYearReport: boolean;
    };
  };
  admissionInfo?: {
    applicationDeadlines: {
      earlyDecision: string | null;
      earlyDecision2: string | null;
      earlyAction: string | null;
      earlyAction2: string | null;
      restrictiveEarlyAction: string | null;
      regular: string | null;
    };
    applicationFees: {
      domestic: string;
      international: string;
    };
    acceptanceRate: string;
    totalEnrolled: string;
    satScores: {
      reading: {
        range: [string, string];
      };
      math: {
        range: [string, string];
      };
    };
    actScores: {
      composite: {
        range: [string, string];
      };
    };
  };
}

interface AdmissionTabProps {
  universityData: AdmissionData;
}

const AdmissionTab: React.FC<AdmissionTabProps> = ({ universityData }) => {
  // Helper function to format acceptance rate
  const formatAcceptanceRate = (rate: number | null) => {
    if (rate === null || isNaN(Number(rate))) return 'N/A';
    return `${(Number(rate) * 100).toFixed(1)}%`;
  };

  // Helper function to format test scores
  const formatScore = (score: number | null): string => {
    return score !== null ? score.toString() : 'Not Available';
  };

  // Helper function to format test scores
  const formatScoreRange = (min: number | null, max: number | null) => {
    if (min === null || max === null || isNaN(min) || isNaN(max)) return 'Not Available';
    return `${Math.round(min)} - ${Math.round(max)}`;
  };

  // Helper function to format application fees
  const formatFee = (fee: string | undefined) => {
    if (!fee) return 'Contact School';
    if (fee === '0' || fee.toLowerCase() === 'no fee') return 'No Fee';
    if (fee.toLowerCase().includes('see')) return 'See School Website';
    return `$${fee}`;
  };

  // Helper function to format test policy
  const formatTestPolicy = (policy: string | undefined, testScoresUsed: string | null | undefined) => {
    return formatTestRequirement(policy, testScoresUsed);
  };

  // Helper function to format requirement status
  const formatRequirement = (value: boolean | undefined | string | null) => {
    if (value === null || value === undefined) return 'Not Available';
    if (typeof value === 'boolean') {
      return value ? 'Required' : 'Not Required';
    }
    if (typeof value === 'string') {
      if (value === '1' || value.toLowerCase() === 'yes') return 'Required';
      if (value === '0' || value.toLowerCase() === 'no') return 'Not Required';
      if (value === 'SR') return 'See Requirements';
      return value;
    }
    return 'Not Available';
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

  // --- New, Definitive Summary Logic ---
  const acceptanceRate = universityData.ADM_RATE;
  const acceptanceRateText = formatAcceptanceRate(acceptanceRate);
  const competitivenessPhrase = getCompetitiveness(acceptanceRate);
  const testingPolicyPhrase = getTestingPolicyPhrase(universityData.ADMCON7);

  let summaryPart1 = '';

  // Create the first part of the summary, which includes the competitiveness line.
  if (acceptanceRateText !== 'N/A' && competitivenessPhrase) {
    summaryPart1 = `${universityData.INSTNM} has an acceptance rate of ${acceptanceRateText}, ${competitivenessPhrase}.`;
  } else if (acceptanceRateText !== 'N/A') {
    summaryPart1 = `${universityData.INSTNM} has an acceptance rate of ${acceptanceRateText}.`;
  } else {
    summaryPart1 = `${universityData.INSTNM} does not publicly report its acceptance rate.`;
  }

  // Combine all parts into the final paragraph.
  const finalSummary = `${summaryPart1} The university ${testingPolicyPhrase}. ${(universityData.SATVR25 || universityData.ACTCM25) ? 'For applicants who provide them, the score ranges above illustrate the typical academic profile of admitted students.' : ''}`;

  return (
    <div className="admission-container">
      {/* Card 1: Admission Statistics */}
      <div className="admission-card">
        <h2>Admission Statistics</h2>
        <div className="admission-stats-grid">
          <div className="acceptance-rate-container">
            <AcceptanceRatePieChart value={universityData.ADM_RATE} />
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
          <p className="summary-text">{finalSummary}</p>
        </div>
      </div>

      {/* Card 2: Application Information */}
      <div className="admission-card">
        <h2>Application Information</h2>
        
        {/* Application Basics */}
        <div className="requirements-section">
          <h3>Application Basics</h3>
          <div className="requirements-grid">
            <div className="requirement-item">
              <span className="requirement-label">Application Fee (Domestic)</span>
              <span className="requirement-value">
                {formatFee(universityData.commonAppInfo?.applicationFees?.domestic)}
              </span>
            </div>
            {universityData.commonAppInfo?.applicationFees?.international && (
              <div className="requirement-item">
                <span className="requirement-label">Application Fee (International)</span>
                <span className="requirement-value">
                  {formatFee(universityData.commonAppInfo.applicationFees.international)}
                </span>
              </div>
            )}
            <div className="requirement-item">
              <span className="requirement-label">Common App</span>
              <span className="requirement-value">
                {universityData.commonAppInfo ? (universityData.commonAppInfo.acceptsCommonApp ? 'Accepted' : 'Not Accepted') : 'Not Available'}
              </span>
            </div>
            {universityData.APPLURL && (
              <div className="requirement-item">
                <span className="requirement-label">Application Portal</span>
                <a 
                  href={universityData.APPLURL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="requirement-value link"
                >
                  Visit Application Portal
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Application Deadlines */}
        <div className="requirements-section">
          <h3>Application Deadlines</h3>
          <div className="requirements-grid">
            {universityData.commonAppInfo?.applicationDeadlines?.regular && (
              <div className="requirement-item">
                <span className="requirement-label">Regular Decision</span>
                <span className="requirement-value">
                  {formatDate(universityData.commonAppInfo.applicationDeadlines.regular)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.applicationDeadlines?.earlyDecision && (
              <div className="requirement-item">
                <span className="requirement-label">Early Decision</span>
                <span className="requirement-value">
                  {formatDate(universityData.commonAppInfo.applicationDeadlines.earlyDecision)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.applicationDeadlines?.earlyDecision2 && (
              <div className="requirement-item">
                <span className="requirement-label">Early Decision II</span>
                <span className="requirement-value">
                  {formatDate(universityData.commonAppInfo.applicationDeadlines.earlyDecision2)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.applicationDeadlines?.earlyAction && (
              <div className="requirement-item">
                <span className="requirement-label">Early Action</span>
                <span className="requirement-value">
                  {formatDate(universityData.commonAppInfo.applicationDeadlines.earlyAction)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.applicationDeadlines?.earlyAction2 && (
              <div className="requirement-item">
                <span className="requirement-label">Early Action II</span>
                <span className="requirement-value">
                  {formatDate(universityData.commonAppInfo.applicationDeadlines.earlyAction2)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.applicationDeadlines?.restrictiveEarlyAction && (
              <div className="requirement-item">
                <span className="requirement-label">Restrictive Early Action</span>
                <span className="requirement-value">
                  {formatDate(universityData.commonAppInfo.applicationDeadlines.restrictiveEarlyAction)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Required Documents */}
        <div className="requirements-section">
          <h3>Required Documents</h3>
          <div className="requirements-grid">
            {universityData.commonAppInfo?.requirements?.personalEssayRequired !== undefined && (
              <div className="requirement-item">
                <span className="requirement-label">Personal Essay</span>
                <span className="requirement-value">
                  {formatRequirement(universityData.commonAppInfo.requirements.personalEssayRequired)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.requirements?.writingSupplement !== undefined && (
              <div className="requirement-item">
                <span className="requirement-label">Writing Supplement</span>
                <span className="requirement-value">
                  {formatRequirement(universityData.commonAppInfo.requirements.writingSupplement)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.requirements?.coursesAndGrades !== undefined && (
              <div className="requirement-item">
                <span className="requirement-label">Courses and Grades</span>
                <span className="requirement-value">
                  {formatRequirement(universityData.commonAppInfo.requirements.coursesAndGrades)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.requirements?.portfolio && (
              <div className="requirement-item">
                <span className="requirement-label">Portfolio</span>
                <span className="requirement-value">
                  {formatRequirement(universityData.commonAppInfo.requirements.portfolio)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.requirements?.testPolicy && (
              <div className="requirement-item">
                <span className="requirement-label">Test Policy</span>
                <span className="requirement-value">
                  {formatTestPolicy(universityData.commonAppInfo.requirements.testPolicy, universityData.commonAppInfo.requirements.testScoresUsed)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.requirements?.testScoresUsed && (
              <div className="requirement-item">
                <span className="requirement-label">Test Scores Used</span>
                <span className="requirement-value">
                  {universityData.commonAppInfo.requirements.testScoresUsed}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="requirements-section">
          <h3>Recommendations</h3>
          <div className="requirements-grid">
            {universityData.commonAppInfo?.recommendations?.teacherEvals && (
              <div className="requirement-item">
                <span className="requirement-label">Teacher Evaluations</span>
                <span className="requirement-value">
                  {universityData.commonAppInfo.recommendations.teacherEvals}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.recommendations?.otherEvals && (
              <div className="requirement-item">
                <span className="requirement-label">Other Evaluations</span>
                <span className="requirement-value">
                  {universityData.commonAppInfo.recommendations.otherEvals}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.recommendations?.counselorRecommendation !== undefined && (
              <div className="requirement-item">
                <span className="requirement-label">Counselor Recommendation</span>
                <span className="requirement-value">
                  {formatRequirement(universityData.commonAppInfo.recommendations.counselorRecommendation)}
                </span>
              </div>
            )}
            {universityData.commonAppInfo?.recommendations?.midYearReport !== undefined && (
              <div className="requirement-item">
                <span className="requirement-label">Mid-Year Report</span>
                <span className="requirement-value">
                  {formatRequirement(universityData.commonAppInfo.recommendations.midYearReport)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* International Student Requirements */}
        {universityData.commonAppInfo?.requirements?.internationalRequirements && (
          <div className="requirements-section">
            <h3>International Student Requirements</h3>
            <div className="requirements-grid">
              <div className="requirement-item">
                <span className="requirement-label">Additional Requirements</span>
                <span className="requirement-value">
                  {universityData.commonAppInfo.requirements.internationalRequirements}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Additional Requirements from College Scorecard */}
        {(universityData.ADMCON1 || universityData.ADMCON2 || universityData.ADMCON3 || 
          universityData.ADMCON4 || universityData.ADMCON5 || universityData.ADMCON6 || 
          universityData.ADMCON8 || universityData.ADMCON9) && (
          <div className="requirements-section">
            <h3>Additional Requirements</h3>
            <div className="requirements-grid">
              {universityData.ADMCON1 && (
                <div className="requirement-item">
                  <span className="requirement-label">Secondary School GPA</span>
                  <span className="requirement-value">{formatRequirement(universityData.ADMCON1)}</span>
                </div>
              )}
              {universityData.ADMCON2 && (
                <div className="requirement-item">
                  <span className="requirement-label">Secondary School Rank</span>
                  <span className="requirement-value">{formatRequirement(universityData.ADMCON2)}</span>
                </div>
              )}
              {universityData.ADMCON3 && (
                <div className="requirement-item">
                  <span className="requirement-label">Secondary School Record</span>
                  <span className="requirement-value">{formatRequirement(universityData.ADMCON3)}</span>
                </div>
              )}
              {universityData.ADMCON4 && (
                <div className="requirement-item">
                  <span className="requirement-label">College-Preparatory Program</span>
                  <span className="requirement-value">{formatRequirement(universityData.ADMCON4)}</span>
                </div>
              )}
              {universityData.ADMCON5 && (
                <div className="requirement-item">
                  <span className="requirement-label">Recommendations</span>
                  <span className="requirement-value">{formatRequirement(universityData.ADMCON5)}</span>
                </div>
              )}
              {universityData.ADMCON6 && (
                <div className="requirement-item">
                  <span className="requirement-label">Formal Competencies</span>
                  <span className="requirement-value">{formatRequirement(universityData.ADMCON6)}</span>
                </div>
              )}
              {universityData.ADMCON8 && (
                <div className="requirement-item">
                  <span className="requirement-label">TOEFL</span>
                  <span className="requirement-value">{formatRequirement(universityData.ADMCON8)}</span>
                </div>
              )}
              {universityData.ADMCON9 && (
                <div className="requirement-item">
                  <span className="requirement-label">Other Tests</span>
                  <span className="requirement-value">{formatRequirement(universityData.ADMCON9)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionTab;