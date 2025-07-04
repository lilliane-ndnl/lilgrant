import React from 'react';
import './Showcase3DIcons.css';

const DBuilding3D: React.FC = () => (
  <svg
    className="showcase-3d-building"
    viewBox="0 0 140 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="mainBody" x1="30" y1="35" x2="90" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#85acd4" />
        <stop offset="1" stopColor="#d497fc" />
      </linearGradient>
      <linearGradient id="sideWing" x1="100" y1="60" x2="130" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#d497fc" />
        <stop offset="1" stopColor="#f7a3c8" />
      </linearGradient>
      <linearGradient id="frontBlock" x1="10" y1="70" x2="50" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f7a3c8" />
        <stop offset="1" stopColor="#85acd4" />
      </linearGradient>
      <radialGradient id="domeHighlight" cx="60%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#eecbff" stopOpacity="0.5" />
      </radialGradient>
    </defs>
    {/* Side wing */}
    <rect x="100" y="60" width="28" height="48" rx="6" fill="url(#sideWing)" />
    {/* Main building */}
    <rect x="40" y="30" width="60" height="70" rx="8" fill="url(#mainBody)" />
    {/* Front block */}
    <rect x="15" y="70" width="32" height="38" rx="7" fill="url(#frontBlock)" />
    {/* Main windows */}
    <g opacity="0.85">
      {/* Main building windows */}
      {[0,1,2].map(row => [0,1,2].map(col => (
        <rect key={`main-${row}-${col}`} x={50+col*15} y={40+row*15} width="10" height="10" rx="2" fill="#ffe29f" />
      )))}
      {/* Side wing windows */}
      {[0,1,2].map(row => (
        <rect key={`wing-${row}`} x={110} y={70+row*13} width="8" height="10" rx="2" fill="#ffe29f" opacity="0.7" />
      ))}
      {/* Front block windows */}
      {[0,1].map(row => [0,1].map(col => (
        <rect key={`front-${row}-${col}`} x={22+col*10} y={80+row*12} width="7" height="9" rx="2" fill="#ffe29f" opacity="0.8" />
      )))}
    </g>
    {/* Dome base */}
    <ellipse cx="70" cy="30" rx="20" ry="8" fill="#d497fc" opacity="0.7" />
    {/* Dome */}
    <ellipse cx="70" cy="24" rx="16" ry="10" fill="url(#domeHighlight)" />
    {/* Dome highlight */}
    <ellipse cx="75" cy="22" rx="6" ry="3" fill="#fff" opacity="0.7" />
    {/* Dome antenna */}
    <rect x="69" y="10" width="2" height="10" rx="1" fill="#b6e0fe" />
    {/* Shadows for 3D effect */}
    <ellipse cx="70" cy="108" rx="55" ry="7" fill="#b993ff" opacity="0.13" />
  </svg>
);

export default DBuilding3D; 