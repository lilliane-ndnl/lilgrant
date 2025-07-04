import React from 'react';
import './ScholarshipsSearch.css';

export interface ScholarshipsSearchFilters {
  keyword: string;
  country: string;
  studyLevel: string;
}

interface ScholarshipsSearchProps {
  filters: ScholarshipsSearchFilters;
  onFiltersChange: (filters: ScholarshipsSearchFilters) => void;
  countries: string[];
  studyLevels: string[];
}

const ScholarshipsSearch: React.FC<ScholarshipsSearchProps> = ({
  filters,
  onFiltersChange,
  countries,
  studyLevels
}) => {
  const handleInputChange = (field: keyof ScholarshipsSearchFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <section className="scholarships-search-bar">
      <div className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search scholarships by keyword..."
          value={filters.keyword}
          onChange={e => handleInputChange('keyword', e.target.value)}
        />
        <select
          className="search-select"
          value={filters.country}
          onChange={e => handleInputChange('country', e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <select
          className="search-select"
          value={filters.studyLevel}
          onChange={e => handleInputChange('studyLevel', e.target.value)}
        >
          <option value="">All Study Levels</option>
          {studyLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default ScholarshipsSearch; 