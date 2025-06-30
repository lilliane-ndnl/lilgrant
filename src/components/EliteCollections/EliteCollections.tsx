import { useState, useEffect } from 'react';
import './EliteCollections.css';

interface Group {
  key: string;
  label: string;
  csv: string;
}

interface EliteCollectionsProps {
  onGroupChange: (group: Group) => void;
}

const GROUPS: Group[] = [
  { key: 'all', label: 'All Universities', csv: 'Full data 675.csv' },
  { key: 'global-top-200', label: 'Global Top 200', csv: 'THE & QS Top 200 Global University.csv' },
  { key: 'early-admission', label: 'Early Admission Paths', csv: 'ED + EA data.csv' },
  { key: 'ivy-league', label: 'Ivy League', csv: 'Ivy League + Stanford Full Data.csv' },
  { key: 'generous-aid', label: 'Generous Aid', csv: 'Zero EFC.csv' },
];

const EliteCollections: React.FC<EliteCollectionsProps> = ({ onGroupChange }) => {
  const [activeGroup, setActiveGroup] = useState(GROUPS[0].key);

  useEffect(() => {
    const group = GROUPS.find(g => g.key === activeGroup);
    if (group && onGroupChange) {
      onGroupChange(group);
    }
  }, [activeGroup, onGroupChange]);

  return (
    <div className="elite-tags-scroll">
      {GROUPS.map(group => (
        <button
          key={group.key}
          className={`elite-tag${activeGroup === group.key ? ' active' : ''}`}
          onClick={() => setActiveGroup(group.key)}
        >
          {group.label}
        </button>
      ))}
    </div>
  );
};

export default EliteCollections; 