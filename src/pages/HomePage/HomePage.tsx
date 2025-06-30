import HeroSection from '../../components/HeroSection/HeroSection'
import FeatureCard from '../../components/FeatureCard/FeatureCard'
import { FaStar, FaUniversity, FaBook } from 'react-icons/fa'
import './HomePage.css'

const features = [
  {
    icon: FaStar,
    title: 'Scholarship Discovery',
    description: 'Explore a hand-picked database of scholarships, with a special focus on simplifying the search for international students.',
    link: '/scholarships',
  },
  {
    icon: FaUniversity,
    title: 'University Hub',
    description: 'Explore universities with detailed profiles, acceptance rates, and financial aid information.',
    link: '/universities',
  },
  {
    icon: FaBook,
    title: 'Guidance & Resources',
    description: 'Get expert tips, strategic guides, and curated resources to give your application an edge.',
    link: '/resources',
  },
]

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <section className="features-section">
        <h2 className="features-title">What Makes LilGrant Special?</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage 