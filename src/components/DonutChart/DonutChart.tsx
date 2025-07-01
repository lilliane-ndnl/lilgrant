import React from 'react';
import './DonutChart.css';

interface DonutChartProps {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  primaryColor?: string;
  backgroundColor?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  value,
  label,
  size = 200,
  strokeWidth = 15,
  primaryColor = 'rgba(138, 43, 226, 0.8)',
  backgroundColor = 'rgba(255, 255, 255, 0.1)'
}) => {
  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressValue = Math.min(Math.max(value, 0), 1); // Clamp between 0 and 1
  const progressOffset = circumference * (1 - progressValue);
  const center = size / 2;

  return (
    <div className="donut-chart-container">
      <svg width={size} height={size} className="donut-chart">
        {/* Background circle */}
        <circle
          className="donut-ring"
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          className="donut-progress"
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={primaryColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
        {/* Center text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          className="donut-text"
          fill="#ffffff"
        >
          <tspan x="50%" dy="-0.2em" className="donut-value">
            {Math.round(value * 100)}%
          </tspan>
          <tspan x="50%" dy="1.6em" className="donut-label">
            {label}
          </tspan>
        </text>
      </svg>
    </div>
  );
};

export default DonutChart; 