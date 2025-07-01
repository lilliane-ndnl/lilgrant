import React from 'react';
import './OverviewTab.css';

interface OverviewTabProps {
  universityData: any; // Replace with proper type
}

const OverviewTab: React.FC<OverviewTabProps> = ({ universityData }) => {
  return (
    <div className="overview-container">
      {/* Basic Information Card */}
      <div className="overview-card">
        <h2>Basic Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <h3>Institution Type</h3>
            <p>{universityData.control || 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Religious Affiliation</h3>
            <p>{universityData.religious_affiliation || 'None'}</p>
          </div>
          <div className="info-item">
            <h3>Region</h3>
            <p>{universityData.region || 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Locale</h3>
            <p>{universityData.locale || 'Not Available'}</p>
          </div>
        </div>
      </div>

      {/* Student Demographics Card */}
      <div className="overview-card">
        <h2>Student Demographics</h2>
        <div className="info-grid">
          <div className="info-item">
            <h3>Total Enrollment</h3>
            <p>{universityData.size ? universityData.size.toLocaleString() : 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Undergraduate Students</h3>
            <p>{universityData.undergrad_enrollment ? universityData.undergrad_enrollment.toLocaleString() : 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Graduate Students</h3>
            <p>{universityData.grad_enrollment ? universityData.grad_enrollment.toLocaleString() : 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Student-to-Faculty Ratio</h3>
            <p>{universityData.student_faculty_ratio || 'Not Available'}</p>
          </div>
        </div>
      </div>

      {/* Admissions Card */}
      <div className="overview-card">
        <h2>Admissions</h2>
        <div className="info-grid">
          <div className="info-item">
            <h3>Acceptance Rate</h3>
            <p>{universityData.admission_rate ? `${(universityData.admission_rate * 100).toFixed(1)}%` : 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Average SAT Score</h3>
            <p>{universityData.sat_average || 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Average ACT Score</h3>
            <p>{universityData.act_average || 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Application Fee</h3>
            <p>{universityData.application_fee ? `$${universityData.application_fee}` : 'Not Available'}</p>
          </div>
        </div>
      </div>

      {/* Costs & Aid Card */}
      <div className="overview-card">
        <h2>Costs & Financial Aid</h2>
        <div className="info-grid">
          <div className="info-item">
            <h3>In-State Tuition</h3>
            <p>{universityData.tuition_in_state ? `$${universityData.tuition_in_state.toLocaleString()}` : 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Out-of-State Tuition</h3>
            <p>{universityData.tuition_out_state ? `$${universityData.tuition_out_state.toLocaleString()}` : 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Students Receiving Aid</h3>
            <p>{universityData.aid_percentage ? `${(universityData.aid_percentage * 100).toFixed(1)}%` : 'Not Available'}</p>
          </div>
          <div className="info-item">
            <h3>Average Aid Amount</h3>
            <p>{universityData.average_aid ? `$${universityData.average_aid.toLocaleString()}` : 'Not Available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab; 