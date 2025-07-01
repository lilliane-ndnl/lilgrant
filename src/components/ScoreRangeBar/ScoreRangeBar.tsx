import React from 'react';
import './ScoreRangeBar.css';

interface ScoreRangeBarProps {
  min: number;
  max: number;
  lowValue: number;
  highValue: number;
  label: string;
  color?: string;
}

const ScoreRangeBar: React.FC<ScoreRangeBarProps> = ({
  min,
  max,
  lowValue,
  highValue,
  label,
  color = 'rgba(138, 43, 226, 0.8)'
}) => {
  // Calculate percentages for positioning
  const range = max - min;
  const lowPercent = ((lowValue - min) / range) * 100;
  const highPercent = ((highValue - min) / range) * 100;
  const rangeWidth = highPercent - lowPercent;

  return (
    <div className="score-range-container">
      <div className="score-label">{label}</div>
      <div className="score-bar-container">
        <div className="score-bar-background">
          <div
            className="score-bar-range"
            style={{
              left: `${lowPercent}%`,
              width: `${rangeWidth}%`,
              backgroundColor: color
            }}
          />
        </div>
        <div className="score-values">
          <span className="score-min">{min}</span>
          <div className="score-range-values">
            <span className="score-low">{lowValue}</span>
            <span className="score-separator">-</span>
            <span className="score-high">{highValue}</span>
          </div>
          <span className="score-max">{max}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreRangeBar; 