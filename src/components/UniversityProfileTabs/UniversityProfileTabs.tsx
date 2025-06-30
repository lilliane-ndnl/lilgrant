import React, { useState } from 'react';
import ReligiousAffiliationDisplay from '../ReligiousAffiliationDisplay/ReligiousAffiliationDisplay';
import './UniversityProfileTabs.css';

interface University {
  name: string;
  city?: string;
  state?: string;
  stateFull?: string;
  control?: string;
  region?: string;
  metroArea?: string;
  setting?: string;
  institutionSize?: string;
  gender?: string;
  hbcu?: string;
  primaryFocus?: string;
  undergraduate?: string;
  studentResidence?: string;
  religious?: string;
  budgetCategory?: string;
  tuitionFees?: string;
  roomBoard?: string;
  totalCost?: string;
  aidTypes?: string;
  numIntlAid?: string;
  pctIntlAid?: string;
  avgAidAmount?: string;
  avgCostAfterAid?: string;
  totalAwardedMillions?: string;
  meetsFullNeed?: string;
  largestMeritAmount?: string;
  largestMeritName?: string;
  costAfterMeritScholarship?: string;
  howToApply?: string;
  acceptanceRate?: string;
  intlAcceptanceRate?: string;
  yield?: string;
  intlYield?: string;
  class2027IntlApps?: string;
  class2027IntlAdmit?: string;
  class2027IntlEnroll?: string;
  rdAcceptanceRate?: string;
  earlyPlanOffered?: string;
  ed2Offered?: string;
  coaYear?: string;
  dataSource?: string;
  costAfterMerit?: string;
  notes?: string;
  officialLink?: string;
  additionalInfo?: Record<string, string>;
}

interface UniversityProfileTabsProps {
  university: University;
}

const UniversityProfileTabs: React.FC<UniversityProfileTabsProps> = ({ university }) => {
  const [activeTab, setActiveTab] = useState('admissions');

  // Function to clean special characters from text
  const cleanText = (text: string | undefined): string => {
    if (!text) return '';
    return text
      .replace(/`/g, '') // Remove backticks
      .replace(/[^\w\s\-.,$%()&]/g, '') // Keep only alphanumeric, spaces, hyphens, commas, periods, dollar signs, percentages, parentheses, and ampersands
      .trim();
  };

  // Function to format data for better readability
  const formatData = (field: string, value: string | undefined): string => {
    if (!value || value === 'N/A' || value === '-') return 'N/A';
    
    const cleanValue = cleanText(value);
    
    switch (field) {
      case 'hbcu':
        return cleanValue === 'Yes' ? 'Historically Black College or University' : cleanValue;
      
      case 'primaryFocus':
        return cleanValue.replace('Arts/Sciences', 'Arts & Sciences');
      
      case 'earlyPlanOffered':
        if (cleanValue === 'Both') return 'Both Early Decision & Early Action';
        if (cleanValue === 'ED only') return 'Early Decision Only';
        if (cleanValue === 'EA only') return 'Early Action Only';
        return cleanValue;
      
      default:
        return cleanValue;
    }
  };

  const hasAdditionalInfo = university.additionalInfo && Object.keys(university.additionalInfo).length > 0;

  const tabs = [
    { id: 'admissions', label: 'Admissions Profile' },
    { id: 'financial', label: 'Cost & Financial Aid' },
    { id: 'campus', label: 'Campus & Culture' },
    ...(hasAdditionalInfo ? [{ id: 'additional', label: 'Additional Information' }] : [])
  ];

  return (
    <div className="university-profile-tabs">
      {/* Tab Navigation */}
      <div className="tabs-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'admissions' && (
          <div className="tab-panel">
            <h3>Admissions Profile</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <strong>Acceptance Rate:</strong>
                </div>
                <div className="info-value">
                  {formatData('acceptanceRate', university.acceptanceRate)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>International Acceptance Rate:</strong>
                </div>
                <div className="info-value">
                  {formatData('intlAcceptanceRate', university.intlAcceptanceRate)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>RD Acceptance Rate:</strong>
                </div>
                <div className="info-value">
                  {formatData('rdAcceptanceRate', university.rdAcceptanceRate)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Yield Rate:</strong>
                </div>
                <div className="info-value">
                  {formatData('yield', university.yield)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>International Yield Rate:</strong>
                </div>
                <div className="info-value">
                  {formatData('intlYield', university.intlYield)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Early Plans Offered:</strong>
                </div>
                <div className="info-value">
                  {formatData('earlyPlanOffered', university.earlyPlanOffered)}
                </div>
              </div>
              {university.ed2Offered && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>ED2 Offered:</strong>
                  </div>
                  <div className="info-value">
                    {formatData('ed2Offered', university.ed2Offered)}
                  </div>
                </div>
              )}
              {university.class2027IntlApps && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>International Applications (Class of 2027):</strong>
                  </div>
                  <div className="info-value">
                    {formatData('class2027IntlApps', university.class2027IntlApps)}
                  </div>
                </div>
              )}
              {university.class2027IntlAdmit && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>International Admitted (Class of 2027):</strong>
                  </div>
                  <div className="info-value">
                    {formatData('class2027IntlAdmit', university.class2027IntlAdmit)}
                  </div>
                </div>
              )}
              {university.class2027IntlEnroll && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>International Enrolled (Class of 2027):</strong>
                  </div>
                  <div className="info-value">
                    {formatData('class2027IntlEnroll', university.class2027IntlEnroll)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="tab-panel">
            <h3>Cost & Financial Aid</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <strong>Tuition & Fees:</strong>
                </div>
                <div className="info-value">
                  {formatData('tuitionFees', university.tuitionFees)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Room & Board:</strong>
                </div>
                <div className="info-value">
                  {formatData('roomBoard', university.roomBoard)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Total Cost:</strong>
                </div>
                <div className="info-value">
                  {formatData('totalCost', university.totalCost)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Average Cost After Aid:</strong>
                </div>
                <div className="info-value">
                  {formatData('avgCostAfterAid', university.avgCostAfterAid)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>International Aid Percentage:</strong>
                </div>
                <div className="info-value">
                  {formatData('pctIntlAid', university.pctIntlAid)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Average Aid Amount:</strong>
                </div>
                <div className="info-value">
                  {formatData('avgAidAmount', university.avgAidAmount)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Number of International Students with Aid:</strong>
                </div>
                <div className="info-value">
                  {formatData('numIntlAid', university.numIntlAid)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Meets Full Need:</strong>
                </div>
                <div className="info-value">
                  {formatData('meetsFullNeed', university.meetsFullNeed)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Total Awarded (Millions):</strong>
                </div>
                <div className="info-value">
                  {formatData('totalAwardedMillions', university.totalAwardedMillions)}
                </div>
              </div>
              {university.largestMeritAmount && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>Largest Merit Amount:</strong>
                  </div>
                  <div className="info-value">
                    {formatData('largestMeritAmount', university.largestMeritAmount)}
                  </div>
                </div>
              )}
              {university.largestMeritName && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>Merit Scholarship Name:</strong>
                  </div>
                  <div className="info-value">
                    {formatData('largestMeritName', university.largestMeritName)}
                  </div>
                </div>
              )}
              {university.costAfterMeritScholarship && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>Cost After Merit Scholarship:</strong>
                  </div>
                  <div className="info-value">
                    {formatData('costAfterMeritScholarship', university.costAfterMeritScholarship)}
                  </div>
                </div>
              )}
              {university.howToApply && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>How to Apply:</strong>
                  </div>
                  <div className="info-value">
                    {formatData('howToApply', university.howToApply)}
                  </div>
                </div>
              )}
              {university.costAfterMerit && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>Cost After Merit:</strong>
                  </div>
                  <div className="info-value">
                    {formatData('costAfterMerit', university.costAfterMerit)}
                  </div>
                </div>
              )}
              {university.coaYear && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>Cost of Attendance Year:</strong>
                  </div>
                  <div className="info-value">
                    {formatData('coaYear', university.coaYear)}
                  </div>
                </div>
              )}
            </div>

            {/* Scholarship Insights & Notes Section */}
            {university.notes && university.notes !== '-' && (
              <div className="scholarship-insights-section">
                <h4>Scholarship Insights & Notes</h4>
                <div className="info-item scholarship-notes-box">
                  <div className="info-value">
                    {cleanText(university.notes)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'campus' && (
          <div className="tab-panel">
            <h3>Campus & Culture</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <strong>Control:</strong>
                </div>
                <div className="info-value">
                  {formatData('control', university.control)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Region:</strong>
                </div>
                <div className="info-value">
                  {formatData('region', university.region)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Setting:</strong>
                </div>
                <div className="info-value">
                  {formatData('setting', university.setting)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Metro Area:</strong>
                </div>
                <div className="info-value">
                  {formatData('metroArea', university.metroArea)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Gender Focus:</strong>
                </div>
                <div className="info-value">
                  {formatData('gender', university.gender)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Is this a Historically Black School?</strong>
                </div>
                <div className="info-value">
                  {university.hbcu || 'N/A'}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Primary Focus:</strong>
                </div>
                <div className="info-value">
                  {formatData('primaryFocus', university.primaryFocus)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Undergraduate Focus:</strong>
                </div>
                <div className="info-value">
                  {formatData('undergraduate', university.undergraduate)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Student Residence:</strong>
                </div>
                <div className="info-value">
                  {formatData('studentResidence', university.studentResidence)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Religious Affiliation:</strong>
                </div>
                <div className="info-value">
                  <ReligiousAffiliationDisplay affiliationData={university.religious || ''} />
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Institution Size:</strong>
                </div>
                <div className="info-value">
                  {formatData('institutionSize', university.institutionSize)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <strong>Budget Category:</strong>
                </div>
                <div className="info-value">
                  {formatData('budgetCategory', university.budgetCategory)}
                </div>
              </div>
              {university.dataSource && (
                <div className="info-item">
                  <div className="info-label">
                    <strong>Data Source:</strong>
                  </div>
                  <div className="info-value">
                    {formatData('dataSource', university.dataSource)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'additional' && hasAdditionalInfo && (
          <div className="tab-panel">
            <h3>Additional Information</h3>
            <div className="info-grid">
              {university.additionalInfo && Object.entries(university.additionalInfo).map(([key, value]) => (
                <div className="info-item" key={key}>
                  <div className="info-label"><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong></div>
                  <div className="info-value">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityProfileTabs; 