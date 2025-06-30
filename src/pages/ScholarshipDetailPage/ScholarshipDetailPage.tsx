import { useParams } from 'react-router-dom'
import './ScholarshipDetailPage.css'

const ScholarshipDetailPage = () => {
  const { scholarshipId } = useParams<{ scholarshipId: string }>()

  return (
    <div className="page-container">
      <h1 className="page-title">Scholarship Detail: {scholarshipId}</h1>
      <div className="page-content">
        <p className="detail-description">
          Full details for the scholarship with ID: {scholarshipId} will appear here. This page will include Title, Amount, Deadline, Sponsors, Eligibility, Requirements, Description, and the Official Link.
        </p>
      </div>
    </div>
  )
}

export default ScholarshipDetailPage 