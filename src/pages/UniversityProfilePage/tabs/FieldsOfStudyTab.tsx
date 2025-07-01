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

type ViewMode = 'size' | 'earnings';

const formatCurrency = (amount: number | 'PrivacySuppressed'): string => {
  if (amount === 'PrivacySuppressed') return 'Privacy Suppressed';
  return `$${amount.toLocaleString()}`;
};

const FieldsOfStudyTab: React.FC<{ unitId: string }> = ({ unitId }) => {
  const [data, setData] = useState<FieldOfStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('size');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  const handleSort = (mode: ViewMode) => {
    if (!data) return;

    const newDirection = mode === viewMode ? (sortDirection === 'desc' ? 'asc' : 'desc') : 'desc';
    setSortDirection(newDirection);
    setViewMode(mode);

    const sortedData = [...data].sort((a, b) => {
      if (mode === 'size') {
        return newDirection === 'desc' 
          ? b.graduates.total - a.graduates.total
          : a.graduates.total - b.graduates.total;
      } else {
        const aEarnings = a.earnings.annual === 'PrivacySuppressed' ? 0 : a.earnings.annual;
        const bEarnings = b.earnings.annual === 'PrivacySuppressed' ? 0 : b.earnings.annual;
        return newDirection === 'desc' ? bEarnings - aEarnings : aEarnings - bEarnings;
      }
    });

    setData(sortedData);
  };

  const getFilteredData = () => {
    if (viewMode === 'earnings') {
      return data.filter(item => 
        item.earnings.annual !== 'PrivacySuppressed' && 
        item.earnings.annual > 0
      );
    }
    return data.filter(item => item.graduates.total > 0);
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
          : `Showing ${programsWithData} programs with enrollment data out of ${totalPrograms} total programs.`
        }
      </p>
      
      <div className="sort-options">
        <button
          className={`sort-button ${viewMode === 'size' ? 'active' : ''}`}
          onClick={() => handleSort('size')}
        >
          Size {viewMode === 'size' && <span className="sort-arrow">↓</span>}
        </button>
        <button
          className={`sort-button ${viewMode === 'earnings' ? 'active' : ''}`}
          onClick={() => handleSort('earnings')}
        >
          Earnings {viewMode === 'earnings' && <span className="sort-arrow">↓</span>}
        </button>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="program-col">Program & Credential</th>
              <th className="metric-col">
                {viewMode === 'size' ? 'Total Graduates' : 'Annual Earnings'}
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
                    : formatCurrency(field.earnings.annual)
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