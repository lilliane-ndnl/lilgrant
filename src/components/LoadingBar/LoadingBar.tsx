import React, { useEffect, useState } from 'react';
import './LoadingBar.css';

const LoadingBar: React.FC = () => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => setActive(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-bar${active ? ' active' : ''}`} />
  );
};

export default LoadingBar; 