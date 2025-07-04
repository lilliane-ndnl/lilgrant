import React, { useState, useEffect, useRef } from 'react';
import './FloatingCard3D.css';

interface FloatingCard3DProps {
  children: React.ReactNode;
  maxRotation?: number; // Maximum rotation angle in degrees
  perspective?: number; // Perspective value in pixels
  glareIntensity?: number; // Intensity of the glare effect (0-1)
}

const FloatingCard3D: React.FC<FloatingCard3DProps> = ({
  children,
  maxRotation = 15,
  perspective = 1000,
  glareIntensity = 0.5
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center as percentage (-1 to 1)
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * maxRotation;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -maxRotation;

      // Calculate glare position (0 to 100)
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;

      setRotation({ x: rotateX, y: rotateY });
      setGlarePosition({ x: glareX, y: glareY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setRotation({ x: 0, y: 0 });
      setGlarePosition({ x: 50, y: 50 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxRotation, isHovering]);

  const style = {
    transform: `perspective(${perspective}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    '--glare-x': `${glarePosition.x}%`,
    '--glare-y': `${glarePosition.y}%`,
    '--glare-opacity': glareIntensity
  } as React.CSSProperties;

  return (
    <div className="floating-card-3d-container">
      <div ref={cardRef} className="floating-card-3d" style={style}>
        <div className="floating-card-3d-content">
          {children}
        </div>
        <div className="floating-card-3d-glare"></div>
      </div>
    </div>
  );
};

export default FloatingCard3D; 