import React from 'react';
import './FeatureCard.css';
import type { IconType } from 'react-icons';

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
  link: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, link }) => {
  return (
    <a className="feature-card" href={link} tabIndex={0}>
      <div className="feature-card-icon">
        <Icon size={48} />
      </div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
    </a>
  );
};

export default FeatureCard; 