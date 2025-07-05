import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import './UniversityConstellation.css';

interface UniversityData {
  id: string | number;
  name: string;
  city: string;
  state: string;
  CONTROL: string | number;
  LOCALE: string | number;
  UGDS: string | number;
  ADM_RATE: string | number;
  NPT4_PUB: string | number;
  NPT4_PRIV: string | number;
  MD_EARN_WNE_P10: string | number;
  COSTT4_A?: string | number;
  sourceList?: string[];
  slug?: string;
  primaryFocus?: string;
  religious?: string;
}

interface UniversityConstellationProps {
  universities: UniversityData[];
  onUniversityClick?: (university: UniversityData) => void;
  isLoading?: boolean;
}

// Individual university text component
const UniversityText: React.FC<{
  university: UniversityData;
  index: number;
  total: number;
  onClick: () => void;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}> = ({ university, index, total, onClick, isHovered, setIsHovered }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  
  // Calculate orbital position
  const radius = 15;
  const angle = (index / total) * Math.PI * 2;
  const height = Math.sin(angle * 3) * 5;
  
  // Brand colors for glow effects
  const colors = ['#5D88B3', '#A84CE6', '#ED3E87'];
  const color = colors[index % colors.length];
  
  useFrame((state) => {
    if (meshRef.current) {
      // Orbital motion
      const time = state.clock.elapsedTime * 0.2;
      const x = Math.cos(angle + time * 0.1) * radius;
      const z = Math.sin(angle + time * 0.1) * radius;
      const y = height + Math.sin(time * 0.5 + index) * 2;
      
      meshRef.current.position.set(x, y, z);
      
      // Gentle rotation
      meshRef.current.rotation.y = time * 0.1 + index * 0.1;
      
      // Hover effects
      if (isHovered) {
        meshRef.current.scale.setScalar(1.2);
        meshRef.current.position.y += 1;
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <Text
        ref={textRef}
        fontSize={0.8}
        color={isHovered ? '#ffffff' : color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
        maxWidth={4}
        textAlign="center"
      >
        {university.name.length > 20 
          ? university.name.substring(0, 20) + '...' 
          : university.name
        }
      </Text>
      
      {/* Glow effect */}
      <mesh position={[0, 0, -0.1]}>
        <Text
          fontSize={0.8}
          color={color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
          maxWidth={4}
          textAlign="center"
          opacity={0.3}
        >
          {university.name.length > 20 
            ? university.name.substring(0, 20) + '...' 
            : university.name
          }
        </Text>
      </mesh>
    </mesh>
  );
};

// Main constellation component
const ConstellationScene: React.FC<{
  universities: UniversityData[];
  onUniversityClick: (university: UniversityData) => void;
}> = ({ universities, onUniversityClick }) => {
  const { camera } = useThree();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 5, 25);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((state) => {
    // Gentle camera movement
    const time = state.clock.elapsedTime * 0.1;
    camera.position.x = Math.sin(time * 0.2) * 2;
    camera.position.y = 5 + Math.sin(time * 0.3) * 1;
  });

  return (
    <>
      {/* Background stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
      
      {/* Central light source */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#5D88B3" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#A84CE6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ED3E87" />
      
      {/* University texts */}
      {universities.slice(0, 50).map((university, index) => (
        <UniversityText
          key={university.id}
          university={university}
          index={index}
          total={Math.min(universities.length, 50)}
          onClick={() => onUniversityClick(university)}
          isHovered={hoveredIndex === index}
          setIsHovered={(hovered) => setHoveredIndex(hovered ? index : null)}
        />
      ))}
      
      {/* Central sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#5D88B3" 
          emissive="#5D88B3"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </>
  );
};

const UniversityConstellation: React.FC<UniversityConstellationProps> = ({
  universities,
  onUniversityClick,
  isLoading = false
}) => {
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityData | null>(null);

  const handleUniversityClick = (university: UniversityData) => {
    setSelectedUniversity(university);
    if (onUniversityClick) {
      onUniversityClick(university);
    }
  };

  if (isLoading) {
    return (
      <div className="constellation-container">
        <div className="constellation-loading">
          <div className="loading-spinner"></div>
          <p>Loading University Constellation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="constellation-container">
      <div className="constellation-header">
        <h2>Explore Universities in 3D Space</h2>
        <p>Click on any university to view details</p>
      </div>
      
      <div className="constellation-canvas">
        <Canvas
          camera={{ position: [0, 5, 25], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <ConstellationScene
            universities={universities}
            onUniversityClick={handleUniversityClick}
          />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.5}
            maxDistance={50}
            minDistance={10}
          />
        </Canvas>
      </div>
      
      {selectedUniversity && (
        <div className="constellation-info">
          <h3>{selectedUniversity.name}</h3>
          <p>{selectedUniversity.city}, {selectedUniversity.state}</p>
          {selectedUniversity.ADM_RATE && (
            <p>Admission Rate: {parseFloat(selectedUniversity.ADM_RATE as string).toFixed(1)}%</p>
          )}
        </div>
      )}
      
      <div className="constellation-instructions">
        <p>💡 <strong>Tip:</strong> Use your mouse to rotate, scroll to zoom, and click universities to explore!</p>
      </div>
    </div>
  );
};

export default UniversityConstellation; 