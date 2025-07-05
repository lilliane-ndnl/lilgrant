import React from 'react';
import './Showcase3DIcons.css';

const Enhanced3DBuilding: React.FC = () => (
  <svg
    className="enhanced-3d-building"
    viewBox="0 0 300 250"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Aura */}
      <radialGradient id="buildingAura" cx="50%" cy="45%" r="70%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
        <stop offset="60%" stopColor="#AED5FC" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#D497FC" stopOpacity="0.10" />
      </radialGradient>
      {/* Main tower: light blue/purple gradient */}
      <linearGradient id="mainTower" x1="80" y1="40" x2="180" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#AED5FC" />
        <stop offset="0.3" stopColor="#85ACD4" />
        <stop offset="0.7" stopColor="#D497FC" />
        <stop offset="1" stopColor="#F7A3C8" />
      </linearGradient>
      {/* Side tower: pink/yellow gradient */}
      <linearGradient id="sideTower" x1="200" y1="80" x2="280" y2="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F7A3C8" />
        <stop offset="0.5" stopColor="#FBFCAE" />
        <stop offset="1" stopColor="#F7A3A3" />
      </linearGradient>
      {/* Front wing: blue/purple gradient */}
      <linearGradient id="frontWing" x1="20" y1="120" x2="80" y2="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#85ACD4" />
        <stop offset="0.4" stopColor="#D497FC" />
        <stop offset="1" stopColor="#F7A3C8" />
      </linearGradient>
      {/* Library wing: yellow/blue gradient */}
      <linearGradient id="libraryWing" x1="220" y1="140" x2="280" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBFCAE" />
        <stop offset="0.6" stopColor="#AED5FC" />
        <stop offset="1" stopColor="#F7A3C8" />
      </linearGradient>
      {/* Dome: ornate, pastel, with rings */}
      <radialGradient id="domeGlow" cx="60%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#D497FC" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#85ACD4" stopOpacity="0.3" />
      </radialGradient>
      {/* Window glow */}
      <linearGradient id="windowGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBFCAE" />
        <stop offset="50%" stopColor="#fff5cc" />
        <stop offset="100%" stopColor="#AED5FC" />
      </linearGradient>
      {/* Sparkle filter */}
      <filter id="sparkle" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fff" floodOpacity="0.9" />
      </filter>
      {/* Building shadow */}
      <filter id="buildingShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#AED5FC" floodOpacity="0.18" />
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#D497FC" floodOpacity="0.12" />
      </filter>
      {/* Window glow filter */}
      <filter id="windowGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Aura */}
    <ellipse cx="150" cy="110" rx="120" ry="80" fill="url(#buildingAura)" />
    {/* Main central tower with brick lines */}
    <rect x="80" y="40" width="100" height="140" rx="12" fill="url(#mainTower)" filter="url(#buildingShadow)" />
    {/* Brick/stone lines */}
    <g opacity="0.13">
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x="80" y={60+i*20} width="100" height="2" fill="#85ACD4" />
      ))}
      {[0,1,2,3].map(i => (
        <rect key={i} x={100+i*30} y="40" width="2" height="140" fill="#D497FC" />
      ))}
    </g>
    {/* Roof ledge */}
    <rect x="80" y="38" width="100" height="8" rx="4" fill="#FBFCAE" opacity="0.7" />
    {/* Side tower with arched windows */}
    <rect x="200" y="80" width="60" height="100" rx="10" fill="url(#sideTower)" filter="url(#buildingShadow)" />
    <g filter="url(#windowGlowFilter)">
      {[0,1,2,3].map(row => (
        <ellipse key={row} cx={230} cy={100+row*20} rx="8" ry="6" fill="#fff" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur={`${2.5 + row * 0.5}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
    </g>
    {/* Front wing with circular windows */}
    <rect x="30" y="120" width="60" height="80" rx="8" fill="url(#frontWing)" filter="url(#buildingShadow)" />
    <g filter="url(#windowGlowFilter)">
      {[0,1,2].map(row => (
        <circle key={row} cx={60} cy={140+row*20} r="6" fill="#FBFCAE" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur={`${3 + row * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
    {/* Library wing with vertical windows */}
    <rect x="220" y="140" width="50" height="60" rx="6" fill="url(#libraryWing)" filter="url(#buildingShadow)" />
    <g filter="url(#windowGlowFilter)">
      {[0,1,2].map(row => (
        <rect key={row} x={235} y={155+row*15} width="30" height="8" rx="2" fill="#AED5FC" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur={`${2.8 + row * 0.4}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </g>
    {/* Main tower windows - more rows/columns with enhanced animation */}
    <g className="main-windows" filter="url(#windowGlowFilter)">
      {[0,1,2,3,4,5,6].map(row => [0,1,2,3,4].map(col => (
        <rect key={`main-${row}-${col}`} x={90+col*16} y={50+row*14} width="12" height="10" rx="3" fill="url(#windowGlow)" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.3;0.9" dur={`${1.5 + Math.random() * 2}s`} repeatCount="indefinite" />
          <animate attributeName="fill" values="url(#windowGlow);#FBFCAE;url(#windowGlow)" dur={`${2 + Math.random() * 1.5}s`} repeatCount="indefinite" />
        </rect>
      )))}
    </g>
    {/* Dome base and ornate rings */}
    <ellipse cx="130" cy="40" rx="35" ry="12" fill="#D497FC" opacity="0.7" />
    <ellipse cx="130" cy="36" rx="32" ry="8" fill="#FBFCAE" opacity="0.4" />
    {/* Main dome with glow and highlight ring */}
    <ellipse cx="130" cy="32" rx="28" ry="16" fill="url(#domeGlow)" filter="url(#sparkle)" />
    <ellipse cx="130" cy="32" rx="20" ry="8" fill="#fff" opacity="0.18" />
    {/* Dome highlight */}
    <ellipse cx="140" cy="28" rx="12" ry="6" fill="#fff" opacity="0.9" />
    {/* Dome animated sparkle */}
    <circle cx="130" cy="24" r="4" fill="#fff" opacity="0.7" filter="url(#sparkle)">
      <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.2s" repeatCount="indefinite" />
    </circle>
    {/* Dome finial (star) */}
    <polygon points="130,10 132,16 138,16 133,20 135,26 130,22 125,26 127,20 122,16 128,16" fill="#FBFCAE" opacity="0.8" filter="url(#sparkle)">
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="rotate" values="0 130 18;360 130 18" dur="8s" repeatCount="indefinite" />
    </polygon>
    {/* Dome antenna */}
    <rect x="128" y="12" width="4" height="16" rx="2" fill="#AED5FC" />
    <circle cx="130" cy="12" r="3" fill="#D497FC" />
    {/* Clock tower */}
    <rect x="120" y="20" width="20" height="25" rx="3" fill="#F7A3C8" opacity="0.7" />
    <circle cx="130" cy="32" r="6" fill="#fff" opacity="0.9" />
    <line x1="130" y1="32" x2="130" y2="28" stroke="#D497FC" strokeWidth="1.5">
      <animateTransform attributeName="transform" type="rotate" values="0 130 32;360 130 32" dur="60s" repeatCount="indefinite" />
    </line>
    <line x1="130" y1="32" x2="134" y2="32" stroke="#D497FC" strokeWidth="1.5">
      <animateTransform attributeName="transform" type="rotate" values="0 130 32;360 130 32" dur="12s" repeatCount="indefinite" />
    </line>
    {/* Architectural details: pastel columns, ledges, flag */}
    <g className="architectural-details">
      {/* Columns */}
      <rect x="75" y="160" width="4" height="20" fill="#85ACD4" opacity="0.7" />
      <rect x="201" y="160" width="4" height="20" fill="#D497FC" opacity="0.7" />
      <rect x="25" y="180" width="4" height="20" fill="#F7A3C8" opacity="0.7" />
      <rect x="271" y="180" width="4" height="20" fill="#F7A3A3" opacity="0.7" />
      {/* Entrance */}
      <rect x="115" y="160" width="30" height="20" rx="3" fill="#F7A3A3" opacity="0.8" />
      <rect x="120" y="165" width="20" height="10" fill="#FBFCAE" opacity="0.7" />
      {/* Flag */}
      <rect x="125" y="15" width="2" height="8" fill="#D497FC" />
      <rect x="127" y="15" width="6" height="4" fill="#F7A3C8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
      </rect>
    </g>
    
    {/* Floating books around the building */}
    <g>
      {/* Book 1 - Floating left */}
      <rect x="40" y="60" width="12" height="16" rx="2" fill="#F7A3C8" opacity="0.8">
        <animate attributeName="y" values="60;50;60" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="42" y="62" width="8" height="2" fill="#D497FC" opacity="0.6" />
      
      {/* Book 2 - Floating right */}
      <rect x="248" y="70" width="10" height="14" rx="2" fill="#AED5FC" opacity="0.7">
        <animate attributeName="y" values="70;60;70" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.8s" repeatCount="indefinite" />
      </rect>
      <rect x="250" y="72" width="6" height="2" fill="#FBFCAE" opacity="0.6" />
      
      {/* Book 3 - Floating above */}
      <rect x="130" y="15" width="8" height="12" rx="2" fill="#FBFCAE" opacity="0.6">
        <animate attributeName="y" values="15;8;15" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3.2s" repeatCount="indefinite" />
      </rect>
    </g>
    
    {/* Animated graduation caps */}
    <g>
      {/* Cap 1 */}
      <rect x="35" y="40" width="16" height="8" rx="2" fill="#D497FC" opacity="0.8">
        <animate attributeName="y" values="40;35;40" dur="3.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <polygon points="35,40 43,40 39,48" fill="#F7A3C8" opacity="0.8" />
      
      {/* Cap 2 */}
      <rect x="249" y="50" width="14" height="7" rx="2" fill="#F7A3C8" opacity="0.7">
        <animate attributeName="y" values="50;45;50" dur="4.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.9s" repeatCount="indefinite" />
      </rect>
      <polygon points="249,50 256,50 252,57" fill="#AED5FC" opacity="0.7" />
    </g>
    
    {/* Ground shadow */}
    <ellipse cx="150" cy="230" rx="120" ry="15" fill="#AED5FC" opacity="0.13" />
    
    {/* Enhanced floating sparkles and particles */}
    <g className="floating-particles">
      <circle cx="50" cy="60" r="3" fill="#fff" opacity="0.8" filter="url(#sparkle)">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="60;55;60" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="250" cy="80" r="2.5" fill="#D497FC" opacity="0.7" filter="url(#sparkle)">
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="cy" values="80;75;80" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="100" r="2.8" fill="#F7A3C8" opacity="0.8" filter="url(#sparkle)">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="100;95;100" dur="4.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="60" r="2.2" fill="#FBFCAE" opacity="0.7" filter="url(#sparkle)">
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.1s" repeatCount="indefinite" />
        <animate attributeName="cy" values="60;55;60" dur="3.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="220" cy="40" r="2" fill="#AED5FC" opacity="0.6" filter="url(#sparkle)">
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.9s" repeatCount="indefinite" />
        <animate attributeName="cy" values="40;35;40" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="70" cy="80" r="2.5" fill="#D497FC" opacity="0.7" filter="url(#sparkle)">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.7s" repeatCount="indefinite" />
        <animate attributeName="cy" values="80;75;80" dur="4.2s" repeatCount="indefinite" />
      </circle>
    </g>
    
    {/* Light rays emanating from building */}
    <g opacity="0.4">
      <line x1="130" y1="25" x2="130" y2="5" stroke="#FBFCAE" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="110" y1="20" x2="90" y2="0" stroke="#AED5FC" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.3s" repeatCount="indefinite" />
      </line>
      <line x1="150" y1="20" x2="170" y2="0" stroke="#D497FC" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.1s" repeatCount="indefinite" />
      </line>
    </g>
  </svg>
);

export default Enhanced3DBuilding; 