import React, { useState, useMemo, useEffect } from 'react';
import AdvancedUniversitySearch from '../../components/AdvancedUniversitySearch/AdvancedUniversitySearch';
import type { SearchFilters } from '../../components/AdvancedUniversitySearch/AdvancedUniversitySearch';
import UniversityCard from '../../components/UniversityCard/UniversityCard';
import Pagination from '../../components/Pagination/Pagination';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import EliteCollections from '../../components/EliteCollections/EliteCollections';
import './UniversityHubPage.css';

// Interface matching the new summary.json structure
interface UniversityData {
  id: string | number;
  name: string;
  city: string;
  state: string;
  CONTROL: string | number;
  LOCALE: string | number;
  UGDS: string | number;
  ADM_RATE: string | number;
  NPT4_PUB: string | number;
  NPT4_PRIV: string | number;
  MD_EARN_WNE_P10: string | number;
  sourceList: string[];
  slug: string;
}

const UniversityHubPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeGroup, setActiveGroup] = useState('all');
  const [allUniversities, setAllUniversities] = useState<UniversityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    state: '',
    city: '',
    setting: '',
    genderFocus: '',
    primaryFocus: '',
    religiousAffiliation: ''
  });
  const itemsPerPage = 28;

  // Fetch all universities from the new data source
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Starting to fetch universities data...');
        
        const response = await fetch('/data/summary.json');
        console.log('Fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch university data (Status: ${response.status}, ${response.statusText})`);
        }
        
        const text = await response.text();
        console.log('Response text length:', text.length);
        console.log('First 100 characters:', text.substring(0, 100));
        
        let data;
        try {
          data = JSON.parse(text);
          console.log('Successfully parsed JSON data');
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Failed to parse university data as JSON');
        }
        
        if (!Array.isArray(data)) {
          console.error('Data is not an array:', typeof data);
          throw new Error('Received data is not an array');
        }
        
        console.log('Universities data received:', {
          count: data.length,
          firstItem: data[0],
          lastItem: data[data.length - 1]
        });
        
        setAllUniversities(data);
      } catch (err) {
        console.error('Error in fetchUniversities:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading universities');
      } finally {
        setLoading(false);
      }
    };
    
    console.log('UniversityHubPage mounted, fetching data...');
    fetchUniversities();
  }, []);

  // Map group key to sourceList code (keeping for future use with detailed data)
  const GROUP_CODE_MAP: { [key: string]: string | null } = {
    'all': null,
    'global-top-200': 'QS200',
    'early-admission': 'ED_EA',
    'ivy-league': 'IVY',
    'generous-aid': 'ZEROEFC',
  };

  // Filter universities for the active group using the sourceList code
  const universitiesForGroup = useMemo(() => {
    console.log('Filtering universities for group:', activeGroup);
    console.log('All universities count:', allUniversities.length);
    if (activeGroup === 'all') return allUniversities;
    const code = GROUP_CODE_MAP[activeGroup];
    if (!code) return allUniversities;
    const filtered = allUniversities.filter(university => 
      university.sourceList && university.sourceList.includes(code)
    );
    console.log('Universities after group filtering:', filtered.length);
    return filtered;
  }, [allUniversities, activeGroup]);

  // Apply search filters to the group's universities
  const filteredUniversities = useMemo(() => {
    console.log('Applying filters to universities');
    console.log('Universities before filtering:', universitiesForGroup.length);
    let filtered = universitiesForGroup.filter(university => {
      // Basic search filters
      if (filters.searchTerm && !university.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.state && university.state !== filters.state) {
        return false;
      }
      if (filters.city && !university.city?.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
      return true;
    });
    console.log('Universities after filtering:', filtered.length);
    return filtered;
  }, [universitiesForGroup, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUniversities = filteredUniversities.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="university-hub-page">
        <LoadingBar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="university-hub-page">
        <div className="error-message">
          <h2>Error Loading Universities</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!allUniversities || allUniversities.length === 0) {
    return (
      <div className="university-hub-page">
        <div className="error-message">
          <h2>No Universities Found</h2>
          <p>No university data is currently available. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="university-hub-page">
      <div className="search-section">
        <AdvancedUniversitySearch
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <EliteCollections activeGroup={activeGroup} onGroupChange={setActiveGroup} />

      <div className="results-info">
        <p>Found {filteredUniversities.length} universities</p>
      </div>

      <div className="university-grid">
        {currentUniversities.map((university) => (
          <UniversityCard key={university.id} university={university} />
        ))}
      </div>

      {filteredUniversities.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default UniversityHubPage; 