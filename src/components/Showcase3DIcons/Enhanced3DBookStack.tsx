import React from 'react';
import './Showcase3DIcons.css';

const Enhanced3DBookStack: React.FC = () => (
  <svg
    className="enhanced-3d-book"
    viewBox="0 0 250 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Aura */}
      <radialGradient id="bookAura" cx="50%" cy="60%" r="60%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
        <stop offset="60%" stopColor="#AED5FC" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#D497FC" stopOpacity="0.10" />
      </radialGradient>
      {/* Book gradients */}
      <linearGradient id="book1" x1="30" y1="140" x2="220" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#85ACD4" />
        <stop offset="1" stopColor="#AED5FC" />
      </linearGradient>
      <linearGradient id="book2" x1="50" y1="110" x2="200" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D497FC" />
        <stop offset="1" stopColor="#F7A3C8" />
      </linearGradient>
      <linearGradient id="book3" x1="70" y1="80" x2="180" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBFCAE" />
        <stop offset="1" stopColor="#F7A3A3" />
      </linearGradient>
      <linearGradient id="book4" x1="90" y1="60" x2="170" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F7A3C8" />
        <stop offset="1" stopColor="#D497FC" />
      </linearGradient>
      <linearGradient id="pageGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="100%" stopColor="#FBFCAE" />
      </linearGradient>
      {/* Sparkle filter */}
      <filter id="sparkle" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#fff" floodOpacity="0.7" />
      </filter>
      {/* Book shadow */}
      <filter id="bookShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#AED5FC" floodOpacity="0.18" />
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#D497FC" floodOpacity="0.12" />
      </filter>
    </defs>
    {/* Aura */}
    <ellipse cx="125" cy="120" rx="90" ry="50" fill="url(#bookAura)" />
    {/* Book 1 (bottom) */}
    <rect x="35" y="140" width="180" height="28" rx="10" fill="url(#book1)" filter="url(#bookShadow)" />
    {/* Book 2 */}
    <rect x="50" y="110" width="150" height="26" rx="9" fill="url(#book2)" filter="url(#bookShadow)" />
    {/* Book 3 */}
    <rect x="70" y="80" width="110" height="24" rx="8" fill="url(#book3)" filter="url(#bookShadow)" />
    {/* Book 4 (top) */}
    <rect x="90" y="60" width="70" height="18" rx="7" fill="url(#book4)" filter="url(#bookShadow)" />
    {/* Spines (vertical lines) */}
    <rect x="50" y="140" width="2" height="28" fill="#D497FC" opacity="0.3" />
    <rect x="70" y="110" width="2" height="26" fill="#F7A3C8" opacity="0.3" />
    <rect x="90" y="80" width="2" height="24" fill="#FBFCAE" opacity="0.3" />
    <rect x="110" y="60" width="2" height="18" fill="#85ACD4" opacity="0.3" />
    {/* Page curves (bottom right of each book) */}
    <ellipse cx="200" cy="166" rx="18" ry="4" fill="#fff" opacity="0.13" />
    <ellipse cx="190" cy="136" rx="14" ry="3" fill="#fff" opacity="0.11" />
    <ellipse cx="170" cy="104" rx="10" ry="2.5" fill="#fff" opacity="0.10" />
    <ellipse cx="150" cy="78" rx="7" ry="2" fill="#fff" opacity="0.09" />
    {/* Bookmark (top book) */}
    <rect x="150" y="60" width="5" height="14" fill="#F7A3C8" opacity="0.8" filter="url(#sparkle)" />
    <polygon points="150,74 155,74 152.5,82" fill="#F7A3C8" opacity="0.8" filter="url(#sparkle)" />
    {/* Glowing star on top book */}
    <polygon points="125,65 127,70 132,70 128,73 130,78 125,75 120,78 122,73 118,70 123,70" fill="#FBFCAE" opacity="0.9" filter="url(#sparkle)" />
    {/* Soft highlight on each book */}
    <ellipse cx="80" cy="150" rx="30" ry="6" fill="#fff" opacity="0.13" />
    <ellipse cx="110" cy="120" rx="22" ry="5" fill="#fff" opacity="0.11" />
    <ellipse cx="130" cy="90" rx="15" ry="4" fill="#fff" opacity="0.10" />
    <ellipse cx="150" cy="70" rx="10" ry="3" fill="#fff" opacity="0.09" />
    {/* Animated glasses (floating left) */}
    <g>
      <g>
        <g>
          <ellipse cx="60" cy="60" rx="10" ry="6" fill="#fff" stroke="#85ACD4" strokeWidth="2" opacity="0.7">
            <animate attributeName="cy" values="60;54;60" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="90" cy="60" rx="10" ry="6" fill="#fff" stroke="#D497FC" strokeWidth="2" opacity="0.7">
            <animate attributeName="cy" values="60;54;60" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <rect x="70" y="58" width="10" height="4" rx="2" fill="#F7A3C8" opacity="0.7" />
        </g>
        <line x1="50" y1="60" x2="40" y2="55" stroke="#85ACD4" strokeWidth="2" opacity="0.6" />
        <line x1="100" y1="60" x2="110" y2="55" stroke="#D497FC" strokeWidth="2" opacity="0.6" />
      </g>
    </g>
    {/* Animated ruler (floating right) */}
    <g>
      <rect x="180" y="80" width="36" height="7" rx="2" fill="#FBFCAE" stroke="#F7A3A3" strokeWidth="1.5" opacity="0.8">
        <animate attributeName="y" values="80;74;80" dur="3.5s" repeatCount="indefinite" />
      </rect>
      {/* Ruler marks */}
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={184+i*6} y="82" width="2" height="3" rx="1" fill="#F7A3A3" opacity="0.7" />
      ))}
    </g>
    {/* Animated compass (floating above) */}
    <g>
      <circle cx="125" cy="45" r="12" fill="none" stroke="#D497FC" strokeWidth="2" opacity="0.8">
        <animate attributeName="cy" values="45;39;45" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <line x1="125" y1="33" x2="125" y2="57" stroke="#F7A3C8" strokeWidth="2" opacity="0.8" />
      <line x1="113" y1="45" x2="137" y2="45" stroke="#F7A3C8" strokeWidth="2" opacity="0.8" />
      <circle cx="125" cy="45" r="2" fill="#FBFCAE" opacity="0.9" />
      <polygon points="125,33 127,37 123,37" fill="#F7A3C8" opacity="0.8" />
    </g>
    {/* Sparkles */}
    <g>
      <circle cx="70" cy="90" r="2" fill="#fff" opacity="0.7" filter="url(#sparkle)">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="120" r="1.5" fill="#FBFCAE" opacity="0.6" filter="url(#sparkle)">
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="80" r="1.2" fill="#D497FC" opacity="0.5" filter="url(#sparkle)">
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </g>
    {/* Ground shadow */}
    <ellipse cx="125" cy="180" rx="100" ry="12" fill="#AED5FC" opacity="0.13" />
  </svg>
);

export default Enhanced3DBookStack; 