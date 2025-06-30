import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, forwardRef } from 'react'
import './Header.css'

const Header = forwardRef<HTMLElement>((_, ref) => {
  const [haloActive, setHaloActive] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(window.scrollY)

  const handleNavClick = () => {
    setHaloActive(true)
    setTimeout(() => setHaloActive(false), 800) // Match animation duration
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current && currentScrollY > 40) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header ref={ref} className={`header${haloActive ? ' halo-active' : ''}${hidden ? ' header--hidden' : ''}`}>
      <div className="header-container">
        {/* Site Name */}
        <div className="site-name">
          <Link to="/" className="site-name-link">
            LilGrant
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/scholarships" className="nav-link" onClick={handleNavClick}>
                Scholarships
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/universities" className="nav-link" onClick={handleNavClick}>
                University Hub
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/resources" className="nav-link" onClick={handleNavClick}>
                Resources
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link" onClick={handleNavClick}>
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={handleNavClick}>
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
})

export default Header 