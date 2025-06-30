import { useEffect, useState } from 'react';
import { readExcelFile } from '../../utils/excelReader';
import type { ExcelData } from '../../utils/excelReader';

const UniversityData = () => {
  const [universities, setUniversities] = useState<ExcelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await readExcelFile('/data/University and College data file.xlsx');
        setUniversities(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load university data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading university data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Universities</h2>
      <pre>{JSON.stringify(universities, null, 2)}</pre>
    </div>
  );
};

export default UniversityData; 