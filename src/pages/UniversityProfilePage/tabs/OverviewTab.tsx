import React from 'react';
import './OverviewTab.css';

interface OverviewTabProps {
  universityData: any; // We'll keep the any type since it matches the parent component
}

const OverviewTab: React.FC<OverviewTabProps> = ({ universityData }) => {
  const formatSchoolType = (control: string | undefined) => {
    if (!control) return 'Not Available';
    switch (control) {
      case '1': return 'Public';
      case '2': return 'Private nonprofit';
      case '3': return 'Private for-profit';
      default: return 'Not Available';
    }
  };

  const formatLocale = (locale: string | undefined) => {
    if (!locale) return 'Not Available';
    const firstTwoDigits = locale.substring(0, 2);
    switch (firstTwoDigits) {
      case '11':
      case '12':
      case '13':
        return 'City';
      case '21':
      case '22':
      case '23':
        return 'Suburb';
      case '31':
      case '32':
      case '33':
        return 'Town';
      case '41':
      case '42':
      case '43':
        return 'Rural';
      default:
        return 'Not Available';
    }
  };

  const formatSize = (sizeset: string | undefined) => {
    if (!sizeset || sizeset === 'NA') return 'Not Available';
    
    switch (sizeset) {
      case '1':
      case '2':
      case '6':
      case '7':
        return 'Small';
      case '3':
      case '8':
        return 'Medium';
      case '4':
      case '9':
        return 'Large';
      default:
        return 'Not Available';
    }
  };

  const formatHighestDegree = (degree: string | undefined) => {
    if (!degree) return 'Not Available';
    switch (degree) {
      case '0': return 'Non-degree-granting';
      case '1': return 'Certificate';
      case '2': return 'Associate degree';
      case '3': return 'Bachelor\'s degree';
      case '4': return 'Graduate degree';
      default: return 'Not Available';
    }
  };

  return (
    <div className="overview-container">
      {/* At a Glance Card */}
      <div className="overview-card">
        <h2>At a Glance</h2>
        <div className="info-grid">
          <div className="info-item">
            <h3>School Type</h3>
            <p>{formatSchoolType(universityData.CONTROL)}</p>
          </div>
          <div className="info-item">
            <h3>Setting</h3>
            <p>{formatLocale(universityData.LOCALE)}</p>
          </div>
          <div className="info-item">
            <h3>Size</h3>
            <p>{formatSize(universityData.CCSIZSET)}</p>
          </div>
          <div className="info-item">
            <h3>Highest Degree Awarded</h3>
            <p>{formatHighestDegree(universityData.HIGHDEG)}</p>
          </div>
        </div>
      </div>

      {/* About this University Card */}
      <div className="overview-card">
        <h2>About this University</h2>
        <p>An AI-generated summary of this university's key strengths, programs, and campus culture will be displayed here soon.</p>
      </div>
    </div>
  );
};

export default OverviewTab;
