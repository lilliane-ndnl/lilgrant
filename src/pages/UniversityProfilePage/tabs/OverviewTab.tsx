import React from 'react';
import './OverviewTab.css';

interface OverviewTabProps {
  universityData: any;
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

  const formatStudentFacultyRatio = (ratio: number | undefined) => {
    if (!ratio) return 'Not Available';
    return `${Math.round(ratio)} to 1`;
  };

  const formatReligiousAffiliation = (code: string | undefined) => {
    if (!code || code === '0') return null;
    // This will be expanded with a complete mapping of religious affiliation codes
    return `Religious Affiliation Code: ${code}`;
  };

  const getInstitutionalCharacteristics = () => {
    const characteristics = [];
    
    if (universityData.HBCU === 1) {
      characteristics.push('Historically Black College or University');
    }
    if (universityData.HSI === 1) {
      characteristics.push('Hispanic-Serving Institution');
    }
    if (universityData.PBI === 1) {
      characteristics.push('Primarily Black Institution');
    }
    if (universityData.WOMENONLY === 1) {
      characteristics.push('Women-Only College');
    }
    if (universityData.MENONLY === 1) {
      characteristics.push('Men-Only College');
    }

    const religiousAffiliation = formatReligiousAffiliation(universityData.RELAFFIL);
    if (religiousAffiliation) {
      characteristics.push(religiousAffiliation);
    }

    return characteristics;
  };

  const characteristics = getInstitutionalCharacteristics();

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
          <div className="info-item">
            <h3>Student-to-Faculty Ratio</h3>
            <p>{formatStudentFacultyRatio(universityData.STUFACR)}</p>
          </div>
        </div>
      </div>

      {/* Institutional Characteristics Card */}
      {characteristics.length > 0 && (
        <div className="overview-card">
          <h2>Institutional Characteristics</h2>
          <div className="characteristics-list">
            {characteristics.map((characteristic, index) => (
              <div key={index} className="characteristic-item">
                {characteristic}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About this University Card */}
      <div className="overview-card">
        <h2>About this University</h2>
        <p>An AI-generated summary of this university's key strengths, programs, and campus culture will be displayed here soon.</p>
      </div>
    </div>
  );
};

export default OverviewTab;
