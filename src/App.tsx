import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'

import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'
import HomePage from './pages/HomePage/HomePage'
import ScholarshipsPage from './pages/ScholarshipsPage/ScholarshipsPage'
import ScholarshipDetailPage from './pages/ScholarshipDetailPage/ScholarshipDetailPage'
import ResourcesPage from './pages/ResourcesPage/ResourcesPage'
import BlogPage from './pages/BlogPage/BlogPage'
import AboutPage from './pages/AboutPage/AboutPage'
import UniversityHubPage from './pages/UniversityHubPage/UniversityHubPage'
import UniversityProfilePage from './pages/UniversityProfilePage/UniversityProfilePage'

function App() {
  const headerRef = useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  return (
    <Router>
      <div className="app">
        <Header ref={headerRef} />
        <main className="main-content" style={{ paddingTop: headerHeight }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route path="/scholarships/:scholarshipId" element={<ScholarshipDetailPage />} />
            <Route path="/universities" element={<UniversityHubPage />} />
            <Route path="/university/:universityId" element={<UniversityProfilePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </Router>
  )
}

export default App
