import React from 'react';
import './OverviewTab.css';
import { getReligiousAffiliation, formatSizeCategory, formatRegion } from '../../../utils/universityDataHelper';

interface OverviewTabProps {
  universityData: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ universityData }) => {
  // Helper function to check if a flag is true (can be either '1' or 1)
  const isTrue = (value: any): boolean => {
    return value === 1 || value === '1';
  };

  const isFalse = (value: any): boolean => {
    return value === 0 || value === '0';
  };

  // Debug log
  console.log('University Data:', {
    HBCU: universityData.HBCU,
    PBI: universityData.PBI,
    HSI: universityData.HSI,
    AANAPII: universityData.AANAPII,
    TRIBAL: universityData.TRIBAL,
    WOMENONLY: universityData.WOMENONLY,
    MENONLY: universityData.MENONLY,
    RELAFFIL: universityData.RELAFFIL,
    CONTROL: universityData.CONTROL,
    LOCALE: universityData.LOCALE,
    UGDS: universityData.UGDS,
    REGION: universityData.REGION,
    HIGHDEG: universityData.HIGHDEG,
    STUFACR: universityData.STUFACR
  });

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

  return (
    <div className="overview-container">
      {/* At a Glance Card */}
      <div className="overview-card">
        <h2>At a Glance</h2>
        <div className="info-grid">
          {/* First Row */}
          <div className="info-item">
            <h3>School Type</h3>
            <p>{formatSchoolType(universityData.CONTROL)}</p>
          </div>
          <div className="info-item">
            <h3>Highest Degree Awarded</h3>
            <p>{formatHighestDegree(universityData.HIGHDEG)}</p>
          </div>
          <div className="info-item">
            <h3>Student-to-Faculty Ratio</h3>
            <p>{formatStudentFacultyRatio(universityData.STUFACR)}</p>
          </div>
          
          {/* Second Row */}
          <div className="info-item">
            <h3>Setting</h3>
            <p>{formatLocale(universityData.LOCALE)}</p>
          </div>
          <div className="info-item">
            <h3>Size</h3>
            <p>{formatSizeCategory(universityData.UGDS)}</p>
          </div>
          <div className="info-item">
            <h3>Region</h3>
            <p>{formatRegion(universityData.REGION)}</p>
          </div>
        </div>
      </div>

      {/* Institutional Characteristics Card */}
      <div className="overview-card">
        <h2>Institutional Characteristics</h2>
        <p className="characteristics-note">Special designations and affiliations that make this institution unique</p>
        <div className="tags-container">
          {isTrue(universityData.HBCU) && (
            <span className="characteristic-tag">Historically Black College or University</span>
          )}
          {isTrue(universityData.PBI) && (
            <span className="characteristic-tag">Primarily Black Institution</span>
          )}
          {isTrue(universityData.HSI) && (
            <span className="characteristic-tag">Hispanic-Serving Institution</span>
          )}
          {isTrue(universityData.AANAPII) && (
            <span className="characteristic-tag">Asian American and Native American Pacific Islander-Serving Institution</span>
          )}
          {isTrue(universityData.TRIBAL) && (
            <span className="characteristic-tag">Tribal College</span>
          )}
          {isTrue(universityData.WOMENONLY) && (
            <span className="characteristic-tag">Women Only</span>
          )}
          {isTrue(universityData.MENONLY) && (
            <span className="characteristic-tag">Men Only</span>
          )}
          {isFalse(universityData.MENONLY) && isFalse(universityData.WOMENONLY) && (
            <span className="characteristic-tag">Co-educational</span>
          )}
          {getReligiousAffiliation(universityData.RELAFFIL) && (
            <span className="characteristic-tag">
              {getReligiousAffiliation(universityData.RELAFFIL)}
            </span>
          )}
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
