import { useEffect, useRef } from 'react'
import './HeroSection.css'

const HeroSection = () => {
  const heroContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (heroContentRef.current) {
        const scrolled = window.pageYOffset
        const rate = scrolled * -0.5 // Parallax rate - adjust for desired effect
        heroContentRef.current.style.transform = `translateY(${rate}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('.features-section')
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content" ref={heroContentRef}>
          {/* Main Headline */}
          <h1 className="hero-headline">
            Unlock Your Future. Discover LilGrant.
          </h1>
          
          {/* Subtext */}
          <p className="hero-subtext">
            Your journey to educational opportunities starts here. LilGrant connects you to scholarships tailored to your dreams, with a smooth, inspiring experience.
          </p>
          
          {/* Call to Action Button */}
          <button onClick={scrollToFeatures} className="btn-primary">
            Explore →
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 