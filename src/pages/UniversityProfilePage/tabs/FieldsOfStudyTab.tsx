import React, { useEffect, useState } from 'react';
import './FieldsOfStudyTab.css';

interface FieldOfStudy {
  cipCode: string;
  programName: string;
  credentialLevel: string;
  credentialCode: string;
  graduates: {
    total: number;
    workingCount: number;
  };
  earnings: {
    annual: number | 'PrivacySuppressed';
    monthly: number | 'PrivacySuppressed';
  };
}

type ViewMode = 'size' | 'earnings' | 'all';
type SortDirection = 'asc' | 'desc';

const formatCurrency = (amount: number | 'PrivacySuppressed'): string => {
  if (amount === 'PrivacySuppressed') return 'Privacy Suppressed';
  return `$${amount.toLocaleString()}`;
};

const FieldsOfStudyTab: React.FC<{ unitId: string }> = ({ unitId }) => {
  const [data, setData] = useState<FieldOfStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('size');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const fetchData = async () => {
      if (!unitId) {
        setError('No university ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/data/fieldsofstudy/${unitId}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch fields of study data (Status: ${response.status})`);
        }

        const jsonData = await response.json();
        if (!Array.isArray(jsonData)) {
          throw new Error('Invalid data format received');
        }
        
        // Initial sort by total graduates descending
        const sortedData = jsonData.sort((a, b) => b.graduates.total - a.graduates.total);
        setData(sortedData);
      } catch (err) {
        console.error('Error fetching fields of study data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [unitId]);

  const handleViewModeChange = (mode: ViewMode) => {
    if (mode === viewMode) {
      // Toggle sort direction if clicking the same mode
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      // Reset to descending order when changing modes
      setViewMode(mode);
      setSortDirection('desc');
    }
  };

  const getFilteredData = () => {
    let filtered = [...data];
    
    if (viewMode === 'earnings') {
      filtered = data.filter(item => 
        item.earnings.annual !== 'PrivacySuppressed' && 
        item.earnings.annual > 0
      );
    } else if (viewMode === 'size') {
      filtered = data.filter(item => item.graduates.total > 0);
    }

    // Sort the data based on view mode and direction
    return filtered.sort((a, b) => {
      if (viewMode === 'earnings') {
        const aEarnings = a.earnings.annual === 'PrivacySuppressed' ? 0 : a.earnings.annual;
        const bEarnings = b.earnings.annual === 'PrivacySuppressed' ? 0 : b.earnings.annual;
        return sortDirection === 'desc' ? Number(bEarnings) - Number(aEarnings) : Number(aEarnings) - Number(bEarnings);
      } else if (viewMode === 'size') {
        return sortDirection === 'desc' ? b.graduates.total - a.graduates.total : a.graduates.total - b.graduates.total;
      } else {
        // 'all' mode - alphabetical sort
        return sortDirection === 'desc' 
          ? b.programName.localeCompare(a.programName) 
          : a.programName.localeCompare(b.programName);
      }
    });
  };

  const getPrivacyNote = (sortMode: ViewMode) => {
    if (sortMode === 'earnings') {
      return "*Some earnings data may be unavailable or suppressed to protect student privacy, particularly for programs with small graduate populations. This is in accordance with federal privacy regulations that safeguard student information. Programs without earnings data are not shown in this view.";
    }
    return null;
  };

  if (loading) {
    return <div className="loading-container">Loading fields of study data...</div>;
  }

  if (error) {
    return <div className="no-data-container">Error: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="no-data-container">No fields of study data available for this institution.</div>;
  }

  const filteredData = getFilteredData();
  const totalPrograms = data.length;
  const programsWithData = filteredData.length;

  return (
    <div className="fields-of-study-container">
      <h2>Fields of Study</h2>
      <p className="description">
        {viewMode === 'earnings' 
          ? `Showing ${programsWithData} programs with earnings data out of ${totalPrograms} total programs.`
          : viewMode === 'size'
          ? `Showing ${programsWithData} programs with enrollment data out of ${totalPrograms} total programs.`
          : `Showing all ${totalPrograms} programs, sorted alphabetically.`
        }
      </p>
      
      <div className="sort-options">
        <button
          className={`sort-button ${viewMode === 'all' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('all')}
        >
          All Majors {viewMode === 'all' && <span className="sort-arrow">{sortDirection === 'desc' ? '↓' : '↑'}</span>}
        </button>
        <button
          className={`sort-button ${viewMode === 'size' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('size')}
        >
          Size {viewMode === 'size' && <span className="sort-arrow">{sortDirection === 'desc' ? '↓' : '↑'}</span>}
        </button>
        <button
          className={`sort-button ${viewMode === 'earnings' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('earnings')}
        >
          Earnings {viewMode === 'earnings' && <span className="sort-arrow">{sortDirection === 'desc' ? '↓' : '↑'}</span>}
        </button>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="program-col">Program & Credential</th>
              <th className="metric-col">
                {viewMode === 'size' ? 'Total Graduates' : viewMode === 'earnings' ? 'Annual Earnings' : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((field, index) => (
              <tr key={`${field.cipCode}-${field.credentialCode}-${index}`}>
                <td className="program-col">
                  <div className="program-name">{field.programName}</div>
                  <div className="credential-level">{field.credentialLevel}</div>
                </td>
                <td className="metric-col">
                  {viewMode === 'size' 
                    ? field.graduates.total.toLocaleString()
                    : viewMode === 'earnings'
                    ? formatCurrency(field.earnings.annual)
                    : ''
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewMode === 'earnings' && (
        <div className="privacy-note">
          {getPrivacyNote('earnings')}
        </div>
      )}
    </div>
  );
};

export default FieldsOfStudyTab; 