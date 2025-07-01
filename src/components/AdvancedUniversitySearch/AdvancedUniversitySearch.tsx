import React from 'react';
import './AdvancedUniversitySearch.css';

export interface SearchFilters {
  searchTerm: string;
  state: string;
  primaryFocus: string;
  religiousAffiliation: string;
}

interface AdvancedUniversitySearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const AdvancedUniversitySearch: React.FC<AdvancedUniversitySearchProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const primaryFocus = ['Arts/Sciences', 'Professional', 'Research', 'Liberal Arts', 'Technical'];

  const religiousAffiliation = [
    { value: '0', label: 'Secular' },
    { value: '1', label: 'Historically Affiliated (Now Secular)' },
    { value: '2', label: 'Secular with Faith-Inspired Values' },
    { value: '3', label: 'Religiously Affiliated (Liberal Culture)' },
    { value: '4', label: 'Moderate Religious Identity' },
    { value: '5', label: 'Conservative Religious Identity' },
    { value: '6', label: 'Primarily a Religious Institution' }
  ];

  return (
    <section className="scholarships-search-bar">
      <div className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by university name..."
          value={filters.searchTerm}
          onChange={e => handleInputChange('searchTerm', e.target.value)}
        />
        <select
          className="search-select"
          value={filters.state}
          onChange={e => handleInputChange('state', e.target.value)}
        >
          <option value="">All States</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <select
          className="search-select"
          value={filters.primaryFocus}
          onChange={e => handleInputChange('primaryFocus', e.target.value)}
        >
          <option value="">All Focus Areas</option>
          {primaryFocus.map(focus => (
            <option key={focus} value={focus}>{focus}</option>
          ))}
        </select>
        <select
          className="search-select"
          value={filters.religiousAffiliation}
          onChange={e => handleInputChange('religiousAffiliation', e.target.value)}
        >
          <option value="">All Affiliations</option>
          {religiousAffiliation.map(affiliation => (
            <option key={affiliation.value} value={affiliation.value}>{affiliation.label}</option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default AdvancedUniversitySearch; 