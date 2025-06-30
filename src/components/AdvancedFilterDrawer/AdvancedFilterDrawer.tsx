import React from 'react';
import './AdvancedFilterDrawer.css';

export interface AdvancedFilters {
  // Cost & Financial Aid
  minTuition: string;
  maxTuition: string;
  minAidAmount: string;
  maxAidAmount: string;
  aidTypes: string[];
  meetsFullNeed: string;
  
  // Admissions
  minAcceptanceRate: string;
  maxAcceptanceRate: string;
  minIntlAcceptanceRate: string;
  maxIntlAcceptanceRate: string;
  
  // Institution Details
  control: string[];
  region: string[];
  institutionSize: string[];
  hbcu: string;
  undergraduate: string[];
  
  // Early Admission
  earlyPlanOffered: string[];
  
  // International Focus
  minIntlAid: string;
  maxIntlAid: string;
  minPctIntlAid: string;
  maxPctIntlAid: string;
}

interface AdvancedFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
}

const AdvancedFilterDrawer: React.FC<AdvancedFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (field: keyof AdvancedFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleArrayFilterChange = (field: keyof AdvancedFilters, value: string, checked: boolean) => {
    const currentArray = (filters[field] as string[]) || [];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFilterChange(field, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
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
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="filter-drawer-backdrop" onClick={onClose}></div>
      )}
      
      {/* Drawer */}
      <div className={`filter-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Advanced Filters</h2>
          <button className="close-btn" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        <div className="drawer-content">
          {/* Cost & Financial Aid Section */}
          <div className="filter-section">
            <h3>Cost & Financial Aid</h3>
            
            <div className="range-inputs">
              <div className="range-group">
                <label>Tuition Range ($)</label>
                <div className="range-inputs-row">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minTuition}
                    onChange={(e) => handleFilterChange('minTuition', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxTuition}
                    onChange={(e) => handleFilterChange('maxTuition', e.target.value)}
                  />
                </div>
              </div>

              <div className="range-group">
                <label>Average Aid Amount ($)</label>
                <div className="range-inputs-row">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minAidAmount}
                    onChange={(e) => handleFilterChange('minAidAmount', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAidAmount}
                    onChange={(e) => handleFilterChange('maxAidAmount', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="checkbox-group">
              <label>Aid Types</label>
              {['Merit', 'Need', 'Both'].map((type) => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.aidTypes.includes(type)}
                    onChange={(e) => handleArrayFilterChange('aidTypes', type, e.target.checked)}
                  />
                  {type}
                </label>
              ))}
            </div>

            <div className="select-group">
              <label>Meets Full Need</label>
              <select
                value={filters.meetsFullNeed}
                onChange={(e) => handleFilterChange('meetsFullNeed', e.target.value)}
              >
                <option value="">Any</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Admissions Section */}
          <div className="filter-section">
            <h3>Admissions</h3>
            
            <div className="range-inputs">
              <div className="range-group">
                <label>Acceptance Rate (%)</label>
                <div className="range-inputs-row">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minAcceptanceRate}
                    onChange={(e) => handleFilterChange('minAcceptanceRate', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAcceptanceRate}
                    onChange={(e) => handleFilterChange('maxAcceptanceRate', e.target.value)}
                  />
                </div>
              </div>

              <div className="range-group">
                <label>International Acceptance Rate (%)</label>
                <div className="range-inputs-row">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minIntlAcceptanceRate}
                    onChange={(e) => handleFilterChange('minIntlAcceptanceRate', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxIntlAcceptanceRate}
                    onChange={(e) => handleFilterChange('maxIntlAcceptanceRate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Institution Details Section */}
          <div className="filter-section">
            <h3>Institution Details</h3>
            
            <div className="checkbox-group">
              <label>Control</label>
              {['Public', 'Private'].map((control) => (
                <label key={control} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.control.includes(control)}
                    onChange={(e) => handleArrayFilterChange('control', control, e.target.checked)}
                  />
                  {control}
                </label>
              ))}
            </div>

            <div className="checkbox-group">
              <label>Region</label>
              {[
                'Northeast (Mid-Atlantic)',
                'Northeast (New England)',
                'Southeast (Deep South)',
                'Southeast (Upper South)',
                'Midwest (Great Lakes)',
                'Midwest (Plains)',
                'Southwest',
                'West (Mountain)',
                'West (Pacific)'
              ].map((region) => (
                <label key={region} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.region.includes(region)}
                    onChange={(e) => handleArrayFilterChange('region', region, e.target.checked)}
                  />
                  {region}
                </label>
              ))}
            </div>

            <div className="checkbox-group">
              <label>Institution Size</label>
              {['S (1K-9K)', 'M (5K-10K)', 'L (10K-20K)', 'XL (20K+)'].map((size) => (
                <label key={size} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.institutionSize.includes(size)}
                    onChange={(e) => handleArrayFilterChange('institutionSize', size, e.target.checked)}
                  />
                  {size}
                </label>
              ))}
            </div>

            <div className="select-group">
              <label>HBCU</label>
              <select
                value={filters.hbcu}
                onChange={(e) => handleFilterChange('hbcu', e.target.value)}
              >
                <option value="">Any</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Early Admission Section */}
          <div className="filter-section">
            <h3>Early Admission</h3>
            
            <div className="checkbox-group">
              <label>Early Plans Offered</label>
              {['EA only', 'ED only', 'Both', 'No'].map((plan) => (
                <label key={plan} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.earlyPlanOffered.includes(plan)}
                    onChange={(e) => handleArrayFilterChange('earlyPlanOffered', plan, e.target.checked)}
                  />
                  {plan}
                </label>
              ))}
            </div>
          </div>

          {/* International Focus Section */}
          <div className="filter-section">
            <h3>International Focus</h3>
            
            <div className="range-inputs">
              <div className="range-group">
                <label>Number of International Students with Aid</label>
                <div className="range-inputs-row">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minIntlAid}
                    onChange={(e) => handleFilterChange('minIntlAid', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxIntlAid}
                    onChange={(e) => handleFilterChange('maxIntlAid', e.target.value)}
                  />
                </div>
              </div>

              <div className="range-group">
                <label>Percentage of International Students with Aid (%)</label>
                <div className="range-inputs-row">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPctIntlAid}
                    onChange={(e) => handleFilterChange('minPctIntlAid', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPctIntlAid}
                    onChange={(e) => handleFilterChange('maxPctIntlAid', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Clear All Filters
          </button>
          <button className="apply-filters-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvancedFilterDrawer; 