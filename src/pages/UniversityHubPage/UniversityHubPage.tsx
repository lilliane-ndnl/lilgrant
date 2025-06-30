import React, { useState, useMemo, useEffect } from 'react';
import AdvancedUniversitySearch from '../../components/AdvancedUniversitySearch/AdvancedUniversitySearch';
import type { SearchFilters } from '../../components/AdvancedUniversitySearch/AdvancedUniversitySearch';
import AdvancedFilterDrawer from '../../components/AdvancedFilterDrawer/AdvancedFilterDrawer';
import type { AdvancedFilters } from '../../components/AdvancedFilterDrawer/AdvancedFilterDrawer';
import UniversityCard from '../../components/UniversityCard/UniversityCard';
import Pagination from '../../components/Pagination/Pagination';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import EliteCollections from '../../components/EliteCollections/EliteCollections';
import './UniversityHubPage.css';

// Interface matching the new summary.json structure
interface UniversityData {
  id: number;
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    state: '',
    city: '',
    setting: '',
    genderFocus: '',
    primaryFocus: '',
    religiousAffiliation: ''
  });
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    minTuition: '',
    maxTuition: '',
    minAidAmount: '',
    maxAidAmount: '',
    aidTypes: [],
    meetsFullNeed: '',
    minAcceptanceRate: '',
    maxAcceptanceRate: '',
    minIntlAcceptanceRate: '',
    maxIntlAcceptanceRate: '',
    control: [],
    region: [],
    institutionSize: [],
    hbcu: '',
    undergraduate: [],
    earlyPlanOffered: [],
    minIntlAid: '',
    maxIntlAid: '',
    minPctIntlAid: '',
    maxPctIntlAid: ''
  });
  const itemsPerPage = 28;

  // Fetch all universities from the new data source
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/data/summary.json');
        if (!response.ok) throw new Error('Failed to fetch university data');
        const data = await response.json();
        setAllUniversities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading universities');
      } finally {
        setLoading(false);
      }
    };
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
    if (activeGroup === 'all') return allUniversities;
    const code = GROUP_CODE_MAP[activeGroup];
    if (!code) return allUniversities;
    return allUniversities.filter(university => 
      university.sourceList && university.sourceList.includes(code)
    );
  }, [allUniversities, activeGroup]);

  // Apply search and advanced filters to the group's universities
  const filteredUniversities = useMemo(() => {
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
      
      // Advanced filters adapted to new data structure
      if (advancedFilters.control.length > 0 && !advancedFilters.control.includes(String(university.CONTROL))) {
        return false;
      }
      
      // Handle admission rate filtering with proper null checking
      const admRate = university.ADM_RATE ? parseFloat(String(university.ADM_RATE)) : null;
      if (advancedFilters.minAcceptanceRate && admRate !== null) {
        if (admRate < parseFloat(advancedFilters.minAcceptanceRate)) return false;
      }
      if (advancedFilters.maxAcceptanceRate && admRate !== null) {
        if (admRate > parseFloat(advancedFilters.maxAcceptanceRate)) return false;
      }
      
      return true;
    });
    return filtered;
  }, [universitiesForGroup, filters, advancedFilters]);

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

  const handleAdvancedFiltersChange = (newAdvancedFilters: AdvancedFilters) => {
    setAdvancedFilters(newAdvancedFilters);
    setCurrentPage(1);
  };

  const handleShowAdvancedFilters = () => {
    setShowAdvancedFilters(true);
  };

  const handleCloseAdvancedFilters = () => {
    setShowAdvancedFilters(false);
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
        <div className="error-container">
          <h1>Error Loading Universities</h1>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="university-hub-page">
      <EliteCollections onGroupChange={group => setActiveGroup(group.key)} />
      <AdvancedUniversitySearch 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onShowAdvancedFilters={handleShowAdvancedFilters}
      />
      <section className="universities-section">
        <div className="universities-container">
          <div className="results-header">
            <h2>Universities ({filteredUniversities.length} found)</h2>
          </div>
          {currentUniversities.length > 0 ? (
            <>
              <div className="universities-grid">
                {currentUniversities.map((university, index) => (
                  <UniversityCard key={`${university.id}-${index}`} university={university} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredUniversities.length}
                itemsPerPage={itemsPerPage}
              />
            </>
          ) : (
            <div className="no-results">
              <h3>No universities found</h3>
              <p>Try adjusting your search criteria or filters to find more results.</p>
            </div>
          )}
        </div>
      </section>
      <AdvancedFilterDrawer
        isOpen={showAdvancedFilters}
        onClose={handleCloseAdvancedFilters}
        filters={advancedFilters}
        onFiltersChange={handleAdvancedFiltersChange}
      />
    </div>
  );
};

export default UniversityHubPage; 