import React, { useState, useRef } from 'react';
import './ReligiousAffiliationDisplay.css';

interface ReligiousAffiliationDisplayProps {
  affiliationData?: string;
}

interface ReligiousAffiliationInfo {
  label: string;
  description: string;
}

const ReligiousAffiliationDisplay: React.FC<ReligiousAffiliationDisplayProps> = ({ affiliationData }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = useRef(`religious-tooltip-${Math.random().toString(36).substr(2, 9)}`).current;

  // Parse the affiliation data to extract the numeric code
  const parseAffiliationCode = (data: string): string => {
    if (!data || data === 'N/A' || data === '-') return '';
    
    // Extract the number from formats like "0-Completely Secular", "1-Historically", etc.
    const match = data.match(/^(\d+)/);
    return match ? match[1] : '';
  };

  // Mapping of religious affiliation codes to user-friendly labels and descriptions
  const religiousAffiliationMap: { [key: string]: ReligiousAffiliationInfo } = {
    '0': {
      label: 'Fully Secular',
      description: 'This institution has no religious affiliation in its history, mission, or campus culture.'
    },
    '1': {
      label: 'Secular with Historic Roots',
      description: 'The school operates with a completely secular mission and culture today, but was founded by a religious group and may retain some historic religious symbols or architecture on campus.'
    },
    '2': {
      label: 'Secular with Faith-Inspired Values',
      description: 'While having no formal religious ties, the university was established by religious founders and its values may be faith-inspired. The campus culture is typically socially and politically liberal.'
    },
    '3': {
      label: 'Religiously Affiliated (Liberal Culture)',
      description: 'Officially affiliated with a religion but maintains a liberal campus culture and a largely secular mission. Students of all faiths are welcomed, and LGBT-positive groups are typically active and encouraged.'
    },
    '4': {
      label: 'Moderate Religious Identity',
      description: 'The school has a moderate religious identity that influences its culture and values. While religious studies may be part of the curriculum, they are often not doctrinal, and there is typically a diversity of faiths and viewpoints on campus.'
    },
    '5': {
      label: 'Conservative Religious Identity',
      description: 'Features a conservative religious identity that strongly shapes the campus culture and mission. Doctrinal religious studies are often required, and the student body may lean socially and politically conservative.'
    },
    '6': {
      label: 'Primarily a Religious Institution',
      description: 'This is fundamentally a religious institution that also offers secular academic programs. Its primary mission is to serve a particular faith, with required religious studies and doctrine-focused faculty.'
    }
  };

  const affiliationCode = parseAffiliationCode(affiliationData || '');
  const affiliationInfo = religiousAffiliationMap[affiliationCode];

  // If no valid affiliation code found, return the original data
  if (!affiliationInfo) {
    return <span>{affiliationData || 'N/A'}</span>;
  }

  return (
    <div className="religious-affiliation-display">
      <span className="affiliation-label">{affiliationInfo.label}</span>
      <button
        type="button"
        className="info-icon"
        aria-label="More information about religious affiliation"
        aria-describedby={tooltipId}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((v) => !v)}
        tabIndex={0}
      >
        i
      </button>
      {showTooltip && (
        <div className="info-tooltip" id={tooltipId} role="tooltip">
          {affiliationInfo.description}
        </div>
      )}
    </div>
  );
};

export default ReligiousAffiliationDisplay; 