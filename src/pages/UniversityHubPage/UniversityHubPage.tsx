import React, { useState, useMemo, useEffect } from 'react';
import AdvancedUniversitySearch from '../../components/AdvancedUniversitySearch/AdvancedUniversitySearch';
import type { SearchFilters } from '../../components/AdvancedUniversitySearch/AdvancedUniversitySearch';
import UniversityCard from '../../components/UniversityCard/UniversityCard';
import Pagination from '../../components/Pagination/Pagination';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
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
  COSTT4_A?: string | number;
  sourceList?: string[];
  slug?: string;
  primaryFocus?: string;
  religious?: string;
}

const UniversityHubPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allUniversities, setAllUniversities] = useState<UniversityData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    state: '',
    primaryFocus: '',
    religiousAffiliation: ''
  });
  const itemsPerPage = 28;

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/data/summary.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch universities (${response.status})`);
        }
        const data = await response.json();
        setAllUniversities(data);
      } catch (err) {
        console.error('Error fetching universities:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Apply filters
  const filteredUniversities = useMemo(() => {
    return allUniversities.filter(university => {
      if (filters.searchTerm && !university.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.state && university.state !== filters.state) {
        return false;
      }
      if (filters.primaryFocus && university.primaryFocus !== filters.primaryFocus) {
        return false;
      }
      if (filters.religiousAffiliation && university.religious !== filters.religiousAffiliation) {
        return false;
      }
      return true;
    });
  }, [allUniversities, filters]);

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

  return (
    <div className="university-hub-page">
      <div className="hub-header">
        <h1>University Hub</h1>
        <p>
          Explore our comprehensive database of universities across the United States. 
          Find detailed information about admission rates, enrollment, costs, and more. 
          Use the search filters below to find the perfect university that matches your 
          academic goals and preferences.
        </p>
      </div>

      <div className="results-info">
        <p>Found {filteredUniversities.length} institutions</p>
      </div>

      <div className="search-section">
        <AdvancedUniversitySearch
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <p className="data-source-disclaimer">
        Data is sourced from the U.S. Department of Education, Common Application, U.S. News, and other verified sources.<br />
        LilGrant does not claim ownership of this data and presents it for informational purposes.
      </p>

      {currentUniversities.length > 0 ? (
        <div className="university-grid">
          {currentUniversities.map((university) => (
            <UniversityCard
              key={university.id}
              university={university}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h3>No Institutions Found</h3>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredUniversities.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default UniversityHubPage; 