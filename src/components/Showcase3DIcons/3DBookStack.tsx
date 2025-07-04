import React from 'react';
import './Showcase3DIcons.css';

const DBookStack3D: React.FC = () => (
  <svg
    className="showcase-3d-book"
    viewBox="0 0 120 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Bottom Book */}
    <rect x="10" y="60" width="100" height="22" rx="8" fill="url(#bookBottom)" />
    <rect x="18" y="70" width="60" height="6" rx="2" fill="#fff" opacity="0.7" />
    {/* Middle Book */}
    <rect x="20" y="38" width="80" height="20" rx="7" fill="url(#bookMiddle)" />
    <rect x="28" y="48" width="50" height="5" rx="2" fill="#fff" opacity="0.6" />
    {/* Top Book */}
    <rect x="32" y="18" width="60" height="18" rx="6" fill="url(#bookTop)" />
    <rect x="40" y="26" width="30" height="4" rx="2" fill="#fff" opacity="0.5" />
    <defs>
      <linearGradient id="bookBottom" x1="10" y1="60" x2="110" y2="82" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f7a3c8" />
        <stop offset="1" stopColor="#fbb1a8" />
      </linearGradient>
      <linearGradient id="bookMiddle" x1="20" y1="38" x2="100" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffe29f" />
        <stop offset="1" stopColor="#ffd6e0" />
      </linearGradient>
      <linearGradient id="bookTop" x1="32" y1="18" x2="92" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#b6e0fe" />
        <stop offset="1" stopColor="#d497fc" />
      </linearGradient>
    </defs>
  </svg>
);

export default DBookStack3D; 