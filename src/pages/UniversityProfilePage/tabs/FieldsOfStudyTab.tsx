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
    byDemographic: {
      male: number | 'PrivacySuppressed';
      nonMale: number | 'PrivacySuppressed';
      pellRecipient: number | 'PrivacySuppressed';
      nonPellRecipient: number | 'PrivacySuppressed';
    };
  };
  deliveryMethod: number;
}

const getDeliveryMethodText = (method: number): string => {
  switch (method) {
    case 1:
      return 'On Campus Only';
    case 2:
      return 'Some Online Options';
    case 3:
      return 'Fully Online';
    default:
      return 'Not Reported';
  }
};

const formatCurrency = (amount: number | 'PrivacySuppressed'): string => {
  if (amount === 'PrivacySuppressed') return 'Privacy Suppressed';
  return `$${amount.toLocaleString()}`;
};

const FieldsOfStudyTab: React.FC<{ unitId: string }> = ({ unitId }) => {
  const [data, setData] = useState<FieldOfStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/data/fieldsofstudy/${unitId}.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch fields of study data');
        }
        const jsonData = await response.json();
        
        // Sort data by program name and credential level
        const sortedData = jsonData.sort((a: FieldOfStudy, b: FieldOfStudy) => {
          const programCompare = a.programName.localeCompare(b.programName);
          if (programCompare !== 0) return programCompare;
          return parseInt(a.credentialCode) - parseInt(b.credentialCode);
        });
        
        setData(sortedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (unitId) {
      fetchData();
    }
  }, [unitId]);

  if (loading) {
    return <div className="loading-container">Loading fields of study data...</div>;
  }

  if (error) {
    return <div className="no-data-container">Error: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="no-data-container">No fields of study data available for this institution.</div>;
  }

  const hasPrivacySuppressed = data.some(item => 
    item.earnings.annual === 'PrivacySuppressed' || 
    Object.values(item.earnings.byDemographic).some(val => val === 'PrivacySuppressed')
  );

  return (
    <div className="fields-of-study-container">
      <h2>Fields of Study</h2>
      <p className="description">
        Explore the various fields of study offered at this institution, including degree levels, 
        graduate outcomes, and median earnings 5 years after graduation.
      </p>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Program</th>
              <th>Credential</th>
              <th>Delivery Method</th>
              <th>Total Graduates</th>
              <th>Working Graduates</th>
              <th>Annual Earnings</th>
              <th>Monthly Earnings</th>
            </tr>
          </thead>
          <tbody>
            {data.map((field, index) => (
              <tr key={`${field.cipCode}-${field.credentialCode}-${index}`}>
                <td>{field.programName}</td>
                <td>{field.credentialLevel}</td>
                <td>{getDeliveryMethodText(field.deliveryMethod)}</td>
                <td>{field.graduates.total.toLocaleString()}</td>
                <td>{field.graduates.workingCount.toLocaleString()}</td>
                <td>{formatCurrency(field.earnings.annual)}</td>
                <td>{formatCurrency(field.earnings.monthly)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasPrivacySuppressed && (
        <div className="privacy-note">
          Note: Some earnings data has been suppressed to protect student privacy when there are few graduates 
          or the data could potentially identify individuals.
        </div>
      )}
    </div>
  );
};

export default FieldsOfStudyTab; 