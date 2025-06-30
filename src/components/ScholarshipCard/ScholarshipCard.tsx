import React, { useCallback } from 'react'
import './ScholarshipCard.css'
import { formatDate } from '../../utils/dateFormatter'

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

interface ScholarshipCardProps {
  scholarshipData: ScholarshipData
  onViewDetails: (scholarship: ScholarshipData) => void
}

const ScholarshipCard = React.memo(({ scholarshipData, onViewDetails }: ScholarshipCardProps) => {
  const handleLearnMore = useCallback(() => {
    onViewDetails(scholarshipData)
  }, [scholarshipData, onViewDetails])

  return (
    <div className="scholarship-card glassmorphism-box" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-header">
        <h3 className="card-title">{scholarshipData.title}</h3>
        <div className="card-meta">
          <span className="card-amount">{scholarshipData.amount}</span>
          {scholarshipData.awards && (
            <span className="card-awards">• {scholarshipData.awards} available</span>
          )}
        </div>
      </div>
      
      <div className="card-content">
        <div className="card-info">
          <div className="card-country">
            <strong>Country:</strong> {scholarshipData.country || 'Not specified'}
          </div>
          
          <div className="card-deadline">
            <strong>Deadline:</strong> {formatDate(scholarshipData.deadline) || 'Not specified'}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
        <button className="btn-primary btn-small" onClick={handleLearnMore}>
          Learn More
        </button>
      </div>
    </div>
  )
})

ScholarshipCard.displayName = 'ScholarshipCard'

export default ScholarshipCard 