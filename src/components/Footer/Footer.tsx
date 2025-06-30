import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-line">
          Lovingly made by{' '}
          <a 
            href="https://www.linkedin.com/in/lilliane-nguyen/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            <em>Lilliane</em>
          </a>
        </p>
        <p className="footer-line">
          © 2025 LilGrant. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer 