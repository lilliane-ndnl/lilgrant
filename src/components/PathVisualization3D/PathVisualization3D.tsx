import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import './PathVisualization3D.css';

interface PathNode {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  color: string;
  size: number;
}

interface PathSegment {
  from: string;
  to: string;
  color: string;
}

const paths: PathNode[] = [
  {
    id: 'discovery',
    position: [-8, 0, 0],
    title: 'Discovery',
    description: 'Find your perfect university match',
    color: '#5D88B3',
    size: 1.2
  },
  {
    id: 'research',
    position: [-4, 2, 2],
    title: 'Research',
    description: 'Explore programs and opportunities',
    color: '#A84CE6',
    size: 1.0
  },
  {
    id: 'application',
    position: [0, 4, 0],
    title: 'Application',
    description: 'Submit your applications',
    color: '#ED3E87',
    size: 1.3
  },
  {
    id: 'scholarships',
    position: [4, 2, -2],
    title: 'Scholarships',
    description: 'Find financial aid opportunities',
    color: '#5D88B3',
    size: 1.1
  },
  {
    id: 'admission',
    position: [8, 0, 0],
    title: 'Admission',
    description: 'Get accepted to your dream school',
    color: '#A84CE6',
    size: 1.4
  }
];

const pathSegments: PathSegment[] = [
  { from: 'discovery', to: 'research', color: '#5D88B3' },
  { from: 'research', to: 'application', color: '#A84CE6' },
  { from: 'application', to: 'scholarships', color: '#ED3E87' },
  { from: 'scholarships', to: 'admission', color: '#5D88B3' }
];

const FloatingNode: React.FC<{ node: PathNode; isHovered: boolean; onHover: (id: string) => void }> = ({ 
  node, 
  isHovered, 
  onHover 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={node.position}>
      <Sphere
        ref={meshRef}
        args={[node.size, 32, 32]}
        onPointerOver={() => {
          onHover(node.id);
          setShowTooltip(true);
        }}
        onPointerOut={() => {
          onHover('');
          setShowTooltip(false);
        }}
      >
        <meshStandardMaterial
          color={node.color}
          emissive={isHovered ? node.color : '#000000'}
          emissiveIntensity={isHovered ? 0.3 : 0}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {showTooltip && (
        <Html position={[0, node.size + 1, 0]} center>
          <div className="path-tooltip">
            <h3>{node.title}</h3>
            <p>{node.description}</p>
          </div>
        </Html>
      )}
      
      <Text
        position={[0, -node.size - 0.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {node.title}
      </Text>
    </group>
  );
};

const PathLine: React.FC<{ from: PathNode; to: PathNode; color: string }> = ({ from, to, color }) => {
  const lineRef = useRef<THREE.Line>(null);
  const [points] = useState(() => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(...from.position),
      new THREE.Vector3(
        (from.position[0] + to.position[0]) / 2,
        (from.position[1] + to.position[1]) / 2 + 1,
        (from.position[2] + to.position[2]) / 2
      ),
      new THREE.Vector3(
        (from.position[0] + to.position[0]) / 2,
        (from.position[1] + to.position[1]) / 2 + 1,
        (from.position[2] + to.position[2]) / 2
      ),
      new THREE.Vector3(...to.position)
    );
    return curve.getPoints(50);
  });

  useFrame((state) => {
    if (lineRef.current) {
      // Animate the line with flowing particles
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.6}
    />
  );
};

const Scene: React.FC = () => {
  const { camera } = useThree();
  const [hoveredNode, setHoveredNode] = useState<string>('');
  const [cameraTarget] = useState(new THREE.Vector3(0, 2, 5));

  useEffect(() => {
    camera.position.set(0, 2, 15);
    camera.lookAt(cameraTarget);
  }, [camera, cameraTarget]);

  useFrame((state) => {
    // Gentle camera rotation
    const time = state.clock.elapsedTime * 0.1;
    camera.position.x = Math.sin(time) * 15;
    camera.position.z = Math.cos(time) * 15;
    camera.lookAt(cameraTarget);
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#5D88B3" />
      
      {/* Background particles */}
      <ParticleField />
      
      {/* Path nodes */}
      {paths.map((node) => (
        <FloatingNode
          key={node.id}
          node={node}
          isHovered={hoveredNode === node.id}
          onHover={setHoveredNode}
        />
      ))}
      
      {/* Path connections */}
      {pathSegments.map((segment, index) => {
        const fromNode = paths.find(p => p.id === segment.from);
        const toNode = paths.find(p => p.id === segment.to);
        if (fromNode && toNode) {
          return (
            <PathLine
              key={index}
              from={fromNode}
              to={toNode}
              color={segment.color}
            />
          );
        }
        return null;
      })}
    </>
  );
};

const ParticleField: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const [particles] = useState(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  });

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#A84CE6"
        transparent
        opacity={0.3}
      />
    </points>
  );
};

const PathVisualization3D: React.FC = () => {
  return (
    <div className="path-visualization-3d">
      <div className="path-visualization-header">
        <h2>Your Educational Journey</h2>
        <p>Explore the path to your dream university</p>
      </div>
      
      <div className="path-visualization-canvas">
        <Canvas
          camera={{ position: [0, 2, 15], fov: 60 }}
          style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}
        >
          <Scene />
        </Canvas>
      </div>
      
      <div className="path-visualization-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#5D88B3' }}></div>
          <span>Discovery & Research</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#A84CE6' }}></div>
          <span>Application Process</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#ED3E87' }}></div>
          <span>Scholarships & Admission</span>
        </div>
      </div>
    </div>
  );
};

export default PathVisualization3D; 