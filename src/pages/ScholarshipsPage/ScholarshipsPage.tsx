import { useState, useEffect, useCallback, useMemo } from 'react'
import ScholarshipCard from '../../components/ScholarshipCard/ScholarshipCard'
import ScholarshipDetailModal from '../../components/ScholarshipDetailModal/ScholarshipDetailModal'
import { PerformanceMonitor, logMemoryUsage } from '../../utils/performance'
import ScholarshipsSearch from '../../components/ScholarshipsSearch/ScholarshipsSearch'
import type { ScholarshipsSearchFilters } from '../../components/ScholarshipsSearch/ScholarshipsSearch'
import LoadingBar from '../../components/LoadingBar/LoadingBar'
import ElegantPagination from '../../components/ElegantPagination/ElegantPagination'
import Enhanced3DStar from '../../components/Showcase3DIcons/Enhanced3DStar'
import './ScholarshipsPage.css'

interface ScholarshipData {
  id: string
  title: string
  amount: string
  awards: string
  deadline: string
  sponsors: string
  description: string
  eligibilityRequirements: string
  studyLevel: string
  fieldOfStudy: string
  country: string
  officialLink: string
  additionalNotes: string
}

const ITEMS_PER_PAGE = 20

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<ScholarshipsSearchFilters>({
    keyword: '',
    country: '',
    studyLevel: ''
  })

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true)
        PerformanceMonitor.startMark('fetch-scholarships')
        
        const response = await fetch('/data/scholarships.json')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch scholarships: ${response.status}`)
        }
        
        const data = await response.json()
        setScholarships(data)
        
        PerformanceMonitor.endMark('fetch-scholarships')
        logMemoryUsage('After loading scholarships')
      } catch (err) {
        console.error('Error fetching scholarships:', err)
        setError(err instanceof Error ? err.message : 'Failed to load scholarships')
      } finally {
        setLoading(false)
      }
    }

    fetchScholarships()
  }, [])

  // Memoized filtered scholarships
  const filteredScholarships = useMemo(() => {
    return scholarships.filter(scholarship => {
      const matchesSearch = filters.keyword === '' || 
        scholarship.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        scholarship.fieldOfStudy.toLowerCase().includes(filters.keyword.toLowerCase())
      
      const matchesCountry = filters.country === '' || 
        scholarship.country.toLowerCase().includes(filters.country.toLowerCase())
      
      const matchesStudyLevel = filters.studyLevel === '' || 
        scholarship.studyLevel.toLowerCase().includes(filters.studyLevel.toLowerCase())
      
      return matchesSearch && matchesCountry && matchesStudyLevel
    })
  }, [scholarships, filters])

  // Memoized pagination
  const paginatedScholarships = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredScholarships.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredScholarships, currentPage])

  const totalPages = Math.ceil(filteredScholarships.length / ITEMS_PER_PAGE)

  // Memoized filter options
  const { countries, studyLevels } = useMemo(() => {
    const countriesSet = new Set<string>()
    const studyLevelsSet = new Set<string>()
    
    scholarships.forEach(scholarship => {
      countriesSet.add(scholarship.country)
      studyLevelsSet.add(scholarship.studyLevel)
    })
    
    return {
      countries: Array.from(countriesSet).sort(),
      studyLevels: Array.from(studyLevelsSet).sort()
    }
  }, [scholarships])

  const handleViewDetails = useCallback((scholarship: ScholarshipData) => {
    setSelectedScholarship(scholarship)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedScholarship(null)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (loading) {
    return (
      <div className="scholarships-page">
        <LoadingBar />
        <div className="page-header">
          <h1>Available Scholarships</h1>
          <p>Loading scholarship opportunities...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="scholarships-page">
        <div className="page-header">
          <h1>Available Scholarships</h1>
          <p>Sorry, we couldn't load the scholarships at this time.</p>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="scholarships-page">
      <div className="hub-header">
        <div className="page-icon-container">
          <Enhanced3DStar />
        </div>
        <h1>Available Scholarships</h1>
        <p>
          Discover funding opportunities for your educational journey. Use the filters below to find scholarships that match your background, interests, and goals.
        </p>
      </div>
      <div className="results-info">
        <p>{filteredScholarships.length} scholarship{filteredScholarships.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Unified Search and Filter Controls */}
      <ScholarshipsSearch
        filters={filters}
        onFiltersChange={setFilters}
        countries={countries}
        studyLevels={studyLevels}
      />

      <div className="scholarships-container">
        <div className="scholarships-grid">
          {paginatedScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarshipData={scholarship}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <ElegantPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {filteredScholarships.length === 0 && !loading && (
          <div className="no-results">
            <p>No scholarships found matching your criteria.</p>
            <button
              onClick={() => {
                setFilters({
                  keyword: '',
                  country: '',
                  studyLevel: ''
                })
                setCurrentPage(1)
              }}
              className="clear-filters-btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {selectedScholarship && (
        <ScholarshipDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          scholarship={selectedScholarship}
        />
      )}
    </div>
  )
}

export default ScholarshipsPage 