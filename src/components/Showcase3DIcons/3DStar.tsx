import React from 'react';
import './Showcase3DIcons.css';

const DStar3D: React.FC = () => (
  <svg
    className="showcase-3d-star"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="starGradient" cx="50%" cy="40%" r="80%">
        <stop offset="0%" stopColor="#b6e0fe" />
        <stop offset="60%" stopColor="#eecbff" />
        <stop offset="100%" stopColor="#f7a3c8" />
      </radialGradient>
      <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#b993ff" floodOpacity="0.35" />
      </filter>
    </defs>
    <polygon
      filter="url(#starShadow)"
      points="60,10 73,45 110,45 80,68 90,105 60,85 30,105 40,68 10,45 47,45"
      fill="url(#starGradient)"
    />
    {/* Sparkles */}
    <circle cx="35" cy="30" r="2" fill="#fff" opacity="0.7" />
    <circle cx="80" cy="25" r="1.5" fill="#fff" opacity="0.6" />
    <circle cx="65" cy="60" r="1.2" fill="#fff" opacity="0.5" />
    <circle cx="50" cy="90" r="1.5" fill="#fff" opacity="0.4" />
  </svg>
);

export default DStar3D; 