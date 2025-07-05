import React from 'react';
import './Showcase3DIcons.css';

const Enhanced3DLaptop: React.FC = () => (
  <svg
    className="showcase-3d-quill"
    viewBox="0 0 250 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Laptop gradients */}
      <linearGradient id="laptopBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2A2A2A" />
        <stop offset="50%" stopColor="#3A3A3A" />
        <stop offset="100%" stopColor="#1A1A1A" />
      </linearGradient>
      <linearGradient id="screenFrame" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A4A4A" />
        <stop offset="100%" stopColor="#2A2A2A" />
      </linearGradient>
      <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#AED5FC" />
        <stop offset="50%" stopColor="#D497FC" />
        <stop offset="100%" stopColor="#F7A3C8" />
      </linearGradient>
      <linearGradient id="keyboard" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3A3A3A" />
        <stop offset="100%" stopColor="#2A2A2A" />
      </linearGradient>
      {/* Star gradients */}
      <linearGradient id="starGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBFCAE" />
        <stop offset="100%" stopColor="#F7A3A3" />
      </linearGradient>
      <linearGradient id="starGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#AED5FC" />
        <stop offset="100%" stopColor="#D497FC" />
      </linearGradient>
      <linearGradient id="starGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7A3C8" />
        <stop offset="100%" stopColor="#FBFCAE" />
      </linearGradient>
      {/* Sparkle filter */}
      <filter id="sparkle" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fff" floodOpacity="0.9" />
      </filter>
      {/* Laptop shadow */}
      <filter id="laptopShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#AED5FC" floodOpacity="0.2" />
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#D497FC" floodOpacity="0.15" />
      </filter>
    </defs>
    
    {/* Laptop base */}
    <rect x="60" y="140" width="130" height="8" rx="4" fill="url(#laptopBody)" filter="url(#laptopShadow)" />
    <rect x="65" y="148" width="120" height="4" rx="2" fill="#1A1A1A" />
    
    {/* Keyboard area */}
    <rect x="70" y="130" width="110" height="10" rx="3" fill="url(#keyboard)" />
    
    {/* Screen frame */}
    <rect x="50" y="60" width="150" height="70" rx="8" fill="url(#screenFrame)" filter="url(#laptopShadow)" />
    
    {/* Screen */}
    <rect x="55" y="65" width="140" height="60" rx="4" fill="url(#screenGlow)" opacity="0.9" />
    
    {/* Screen content - animated elements */}
    <g>
      {/* Moving letters on screen */}
      <text x="70" y="85" fontSize="10" fill="#fff" opacity="0.9" fontWeight="bold">
        <animate attributeName="y" values="85;80;85" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2.5s" repeatCount="indefinite" />
        BLOG
      </text>
      
      <text x="160" y="95" fontSize="8" fill="#FBFCAE" opacity="0.8" fontWeight="bold">
        <animate attributeName="y" values="95;90;95" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.8s" repeatCount="indefinite" />
        POST
      </text>
      
      <text x="80" y="105" fontSize="9" fill="#AED5FC" opacity="0.7" fontWeight="bold">
        <animate attributeName="y" values="105;100;105" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3.2s" repeatCount="indefinite" />
        WRITE
      </text>
      
      <text x="170" y="115" fontSize="7" fill="#D497FC" opacity="0.6" fontWeight="bold">
        <animate attributeName="y" values="115;110;115" dur="3.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.9s" repeatCount="indefinite" />
        SHARE
      </text>
    </g>
    
    {/* Animated stars on screen */}
    <g>
      {/* Star 1 - Top left of screen */}
      <polygon 
        points="70,75 75,80 80,80 77,83 78,88 73,85 68,88 69,83 66,80 71,80" 
        fill="url(#starGradient1)" 
        filter="url(#sparkle)"
        opacity="0.9"
      >
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2.5s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" values="0 73 80;360 73 80" dur="6s" repeatCount="indefinite" />
      </polygon>
      
      {/* Star 2 - Top right of screen */}
      <polygon 
        points="175,70 180,75 185,75 182,78 183,83 178,80 173,83 174,78 171,75 176,75" 
        fill="url(#starGradient2)" 
        filter="url(#sparkle)"
        opacity="0.8"
      >
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" values="0 178 77;360 178 77" dur="7s" repeatCount="indefinite" />
      </polygon>
      
      {/* Star 3 - Bottom left of screen */}
      <polygon 
        points="65,110 70,115 75,115 72,118 73,123 68,120 63,123 64,118 61,115 66,115" 
        fill="url(#starGradient3)" 
        filter="url(#sparkle)"
        opacity="0.7"
      >
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.8s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" values="0 68 117;360 68 117" dur="5s" repeatCount="indefinite" />
      </polygon>
      
      {/* Star 4 - Bottom right of screen */}
      <polygon 
        points="180,105 185,110 190,110 187,113 188,118 183,115 178,118 179,113 176,110 181,110" 
        fill="url(#starGradient1)" 
        filter="url(#sparkle)"
        opacity="0.8"
      >
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3.2s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" values="0 183 112;360 183 112" dur="6.5s" repeatCount="indefinite" />
      </polygon>
    </g>
    
    {/* Floating sparkles around laptop */}
    <g>
      <circle cx="40" cy="80" r="3" fill="#fff" opacity="0.9" filter="url(#sparkle)">
        <animate attributeName="cy" values="80;75;80" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="210" cy="75" r="2.5" fill="#FBFCAE" opacity="0.8" filter="url(#sparkle)">
        <animate attributeName="cy" values="75;70;75" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="35" cy="110" r="2.8" fill="#D497FC" opacity="0.7" filter="url(#sparkle)">
        <animate attributeName="cy" values="110;105;110" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="215" cy="105" r="2.2" fill="#F7A3C8" opacity="0.8" filter="url(#sparkle)">
        <animate attributeName="cy" values="105;100;105" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="125" cy="45" r="2" fill="#AED5FC" opacity="0.7" filter="url(#sparkle)">
        <animate attributeName="cy" values="45;40;45" dur="3.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.9s" repeatCount="indefinite" />
      </circle>
    </g>
    
    {/* Animated cursor on screen */}
    <rect x="75" y="90" width="2" height="12" fill="#fff" opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1s" repeatCount="indefinite" />
    </rect>
    
    {/* Animated typing dots */}
    <g>
      <circle cx="85" y="120" r="2" fill="#FBFCAE" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="95" y="120" r="2" fill="#AED5FC" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="105" y="120" r="2" fill="#D497FC" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.5s" begin="1s" repeatCount="indefinite" />
      </circle>
    </g>
    
    {/* Light rays emanating from laptop */}
    <g opacity="0.5">
      <line x1="125" y1="55" x2="125" y2="35" stroke="#FBFCAE" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="105" y1="50" x2="85" y2="30" stroke="#AED5FC" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.3s" repeatCount="indefinite" />
      </line>
      <line x1="145" y1="50" x2="165" y2="30" stroke="#D497FC" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.1s" repeatCount="indefinite" />
      </line>
    </g>
    
    {/* Ground shadow */}
    <ellipse cx="125" cy="190" rx="70" ry="8" fill="#AED5FC" opacity="0.15" />
  </svg>
);

export default Enhanced3DLaptop; 