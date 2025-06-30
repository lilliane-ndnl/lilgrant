import { useEffect } from 'react'
import './ScholarshipDetailModal.css'
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

interface ScholarshipDetailModalProps {
  scholarship: ScholarshipData | null
  isOpen: boolean
  onClose: () => void
}

const ScholarshipDetailModal = ({ scholarship, isOpen, onClose }: ScholarshipDetailModalProps) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle backdrop click to close modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // Format text with newlines and basic markdown-like formatting
  const formatText = (text: string) => {
    if (!text) return 'Not specified'
    
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  const handleApplyNow = () => {
    if (scholarship?.officialLink) {
      window.open(scholarship.officialLink, '_blank', 'noopener,noreferrer')
    }
  }

  if (!isOpen || !scholarship) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{scholarship.title}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="scholarship-details">
            <div className="detail-section">
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Amount:</strong>
                  <span className="amount-value">{scholarship.amount}</span>
                </div>
                <div className="detail-item">
                  <strong>Awards Available:</strong>
                  <span>{scholarship.awards || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <strong>Deadline:</strong>
                  <span>{formatDate(scholarship.deadline) || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <strong>Country:</strong>
                  <span>{scholarship.country || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <strong>Study Level:</strong>
                  <span>{scholarship.studyLevel || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <strong>Field of Study:</strong>
                  <span>{scholarship.fieldOfStudy || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <strong>Sponsors:</strong>
                  <span>{scholarship.sponsors || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <strong>Scholarship Link:</strong>
                  <span className="url-link">
                    {scholarship.officialLink ? (
                      <a href={scholarship.officialLink} target="_blank" rel="noopener noreferrer">
                        {scholarship.officialLink}
                      </a>
                    ) : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Description</h3>
              <p className="description-text">
                {formatText(scholarship.description)}
              </p>
            </div>

            <div className="detail-section">
              <h3>Eligibility Requirements</h3>
              <div className="requirements-text">
                {formatText(scholarship.eligibilityRequirements)}
              </div>
            </div>

            {scholarship.additionalNotes && (
              <div className="detail-section">
                <h3>Additional Notes</h3>
                <p className="notes-text">
                  {formatText(scholarship.additionalNotes)}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
          {scholarship.officialLink && (
            <button className="btn-primary" onClick={handleApplyNow}>
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScholarshipDetailModal 