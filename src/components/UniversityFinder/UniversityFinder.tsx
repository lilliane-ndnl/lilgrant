import React, { useEffect, useState } from 'react';
import UniversityCard, { UniversityData } from '../UniversityCard/UniversityCard';
import './UniversityFinder.css';

const DATA_URL = '/data/summary.json';

interface StateOption {
  value: string;
  label: string;
}

const getUniqueStates = (universities: UniversityData[]): StateOption[] => {
  const stateMap = new Map<string, string>();
  
  universities.forEach(u => {
    if (u.state) {
      // Use state abbreviation as both value and label for now
      stateMap.set(u.state, u.state);
    }
  });
  
  return Array.from(stateMap.entries())
    .map(([abbreviation, fullName]) => ({
      value: abbreviation,
      label: fullName
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const UniversityFinder: React.FC = () => {
  const [allUniversities, setAllUniversities] = useState<UniversityData[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<UniversityData[]>([]);
  const [stateFilter, setStateFilter] = useState('All');
  const [maxSizeFilter, setMaxSizeFilter] = useState('');
  const [controlFilter, setControlFilter] = useState('Any');
  const [states, setStates] = useState<StateOption[]>([]);

  useEffect(() => {
    fetch(DATA_URL)
      .then(response => {
        console.log('Fetch Response:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: UniversityData[]) => {
        console.log('Parsed JSON Data:', data);
        console.log(`Successfully fetched ${data.length} universities.`);
        setAllUniversities(data);
        setFilteredUniversities(data);
        setStates(getUniqueStates(data));
      })
      .catch(error => {
        console.error('Error fetching or parsing university data:', error);
      });
  }, []);

  useEffect(() => {
    console.log('Filtering with values:', { stateFilter, maxSizeFilter, controlFilter });
    let filtered = allUniversities;
    if (stateFilter !== 'All') {
      filtered = filtered.filter(u => u.state === stateFilter);
    }
    if (maxSizeFilter) {
      const max = parseInt(maxSizeFilter.replace(/[^\d]/g, ''));
      filtered = filtered.filter(u => u.size <= max);
    }
    if (controlFilter !== 'Any') {
      const controlMap: { [key: string]: number } = {
        'Public': 1,
        'Private Nonprofit': 2,
        'Private For-profit': 3
      };
      const controlValue = controlMap[controlFilter];
      if (controlValue) {
        filtered = filtered.filter(u => u.control === controlValue);
      }
    }
    console.log(`Filtering logic produced ${filtered.length} results.`, filtered);
    setFilteredUniversities(filtered);
  }, [stateFilter, maxSizeFilter, controlFilter, allUniversities]);

  console.log('Rendering component with state:', {
    allUniversitiesCount: allUniversities.length,
    filteredUniversitiesCount: filteredUniversities.length
  });

  return (
    <div className="university-finder">
      <div className="filters-glass">
        <label>
          State:
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
            <option value="All">All States</option>
            {states.map(state => (
              <option key={state.value} value={state.value}>{state.label}</option>
            ))}
          </select>
        </label>
        <label>
          Max Size:
          <input
            type="number"
            placeholder="e.g. 10000"
            value={maxSizeFilter}
            onChange={e => setMaxSizeFilter(e.target.value)}
          />
        </label>
        <label>
          Control:
          <select value={controlFilter} onChange={e => setControlFilter(e.target.value)}>
            <option value="Any">Any</option>
            <option value="Public">Public</option>
            <option value="Private Nonprofit">Private Nonprofit</option>
            <option value="Private For-profit">Private For-profit</option>
          </select>
        </label>
      </div>
      <h2 className="results-count">{filteredUniversities.length} Universities Found</h2>
      <div className="university-cards-grid">
        {filteredUniversities.map(u => (
          <UniversityCard key={u.id} university={u} />
        ))}
      </div>
    </div>
  );
};

export default UniversityFinder; 