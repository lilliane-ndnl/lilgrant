import React from 'react';
import './Showcase3DIcons.css';

const Enhanced3DStar: React.FC = () => (
  <svg
    className="enhanced-3d-star"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Multiple gradient definitions for complex effects */}
      <radialGradient id="starCore" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#b6e0fe" />
        <stop offset="70%" stopColor="#eecbff" />
        <stop offset="100%" stopColor="#f7a3c8" />
      </radialGradient>
      
      <radialGradient id="starOuter" cx="50%" cy="40%" r="80%">
        <stop offset="0%" stopColor="#f7a3c8" />
        <stop offset="50%" stopColor="#eecbff" />
        <stop offset="100%" stopColor="#b6e0fe" />
      </radialGradient>
      
      <linearGradient id="starGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#b6e0fe" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#eecbff" stopOpacity="0.2" />
      </linearGradient>
      
      <filter id="starShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#b993ff" floodOpacity="0.4" />
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#f7a3c8" floodOpacity="0.3" />
      </filter>
      
      <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Background glow */}
    <circle cx="100" cy="80" r="70" fill="url(#starGlow)" opacity="0.3" />
    
    {/* Outer star layer */}
    <polygon
      filter="url(#starShadow)"
      points="100,20 120,70 180,70 135,105 150,165 100,135 50,165 65,105 20,70 80,70"
      fill="url(#starOuter)"
      opacity="0.8"
    />
    
    {/* Main star */}
    <polygon
      filter="url(#starShadow)"
      points="100,30 115,70 160,70 125,100 135,150 100,125 65,150 75,100 40,70 85,70"
      fill="url(#starCore)"
    />
    
    {/* Inner star highlight */}
    <polygon
      points="100,40 110,70 145,70 120,95 127,135 100,115 73,135 80,95 55,70 90,70"
      fill="url(#starGlow)"
      opacity="0.6"
    />
    
    {/* Multiple sparkle layers */}
    <g className="sparkles">
      {/* Large sparkles */}
      <circle cx="60" cy="50" r="3" fill="#fff" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="140" cy="45" r="2.5" fill="#fff" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="100" r="2" fill="#fff" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.8s" repeatCount="indefinite" />
      </circle>
      
      {/* Medium sparkles */}
      <circle cx="80" cy="30" r="1.5" fill="#b6e0fe" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="160" cy="60" r="1.8" fill="#eecbff" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.9s" repeatCount="indefinite" />
      </circle>
      <circle cx="70" cy="120" r="1.3" fill="#f7a3c8" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.1s" repeatCount="indefinite" />
      </circle>
      
      {/* Small sparkles */}
      <circle cx="45" cy="80" r="1" fill="#fff" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="130" cy="90" r="0.8" fill="#b6e0fe" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="90" cy="140" r="1.2" fill="#eecbff" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.3s" repeatCount="indefinite" />
      </circle>
    </g>
    
    {/* Orbital rings */}
    <ellipse cx="100" cy="80" rx="85" ry="25" fill="none" stroke="url(#starGlow)" strokeWidth="1" opacity="0.3">
      <animateTransform attributeName="transform" type="rotate" values="0 100 80;360 100 80" dur="20s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="100" cy="80" rx="65" ry="18" fill="none" stroke="url(#starGlow)" strokeWidth="0.8" opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" values="360 100 80;0 100 80" dur="15s" repeatCount="indefinite" />
    </ellipse>
  </svg>
);

export default Enhanced3DStar; 