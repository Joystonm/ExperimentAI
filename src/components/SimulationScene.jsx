import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Plane } from '@react-three/drei';

const SimulationScene = ({ experimentType, isPlaying, onKeyMoment }) => {
  const mainRef = useRef();
  const timeRef = useRef(0);
  const keyMomentTriggered = useRef(false);

  useFrame((state, delta) => {
    if (!isPlaying) return;
    
    timeRef.current += delta;
    
    // Trigger key moment explanation after 5 seconds
    if (timeRef.current > 5 && !keyMomentTriggered.current) {
      keyMomentTriggered.current = true;
      onKeyMoment();
    }
  });

  const renderExperiment = () => {
    switch (experimentType) {
      case 'pendulum':
        return <PendulumSimulation ref={mainRef} isPlaying={isPlaying} />;
      case 'spring':
        return <SpringSimulation ref={mainRef} isPlaying={isPlaying} />;
      case 'friction':
        return <FrictionSimulation ref={mainRef} isPlaying={isPlaying} />;
      case 'incline':
        return <InclineSimulation ref={mainRef} isPlaying={isPlaying} />;
      case 'lens':
        return <LensSimulation ref={mainRef} isPlaying={isPlaying} />;
      case 'mirror':
        return <MirrorSimulation ref={mainRef} isPlaying={isPlaying} />;
      default:
        return null;
    }
  };

  return (
    <group>
      {/* Environment */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <meshStandardMaterial color="#1e293b" />
      </Plane>
      
      {/* Grid */}
      <gridHelper args={[20, 20, '#334155', '#334155']} position={[0, -2.9, 0]} />
      
      {renderExperiment()}
    </group>
  );
};

const PendulumSimulation = React.forwardRef(({ isPlaying }, ref) => {
  const pendulumRef = useRef();
  
  useFrame((state) => {
    if (!isPlaying || !pendulumRef.current) return;
    
    const time = state.clock.elapsedTime;
    const angle = Math.sin(time * 1.5) * 0.8; // Damped oscillation
    const damping = Math.exp(-time * 0.1);
    
    pendulumRef.current.rotation.z = angle * damping;
  });

  return (
    <group ref={ref} position={[0, 2, 0]}>
      {/* Pivot */}
      <Box args={[0.2, 0.2, 0.2]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#64748b" />
      </Box>
      
      {/* String */}
      <Cylinder args={[0.02, 0.02, 3]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#475569" />
      </Cylinder>
      
      {/* Bob */}
      <group ref={pendulumRef}>
        <Sphere args={[0.3]} position={[0, -1, 0]}>
          <meshStandardMaterial color="#00e5ff" />
        </Sphere>
      </group>
      
      {/* Energy indicators */}
      <Sphere args={[0.1]} position={[-2, 1, 0]}>
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
      </Sphere>
      <Sphere args={[0.1]} position={[2, 1, 0]}>
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  );
});

const SpringSimulation = React.forwardRef(({ isPlaying }, ref) => {
  const massRef = useRef();
  
  useFrame((state) => {
    if (!isPlaying || !massRef.current) return;
    
    const time = state.clock.elapsedTime;
    const displacement = Math.sin(time * 2) * 0.8;
    
    massRef.current.position.y = displacement;
  });

  return (
    <group ref={ref}>
      {/* Base */}
      <Box args={[1, 0.2, 1]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      
      {/* Spring coils */}
      {Array.from({ length: 8 }, (_, i) => (
        <Cylinder 
          key={i} 
          args={[0.15, 0.15, 0.1]} 
          position={[0, -1.5 + i * 0.2, 0]}
        >
          <meshStandardMaterial color="#10b981" />
        </Cylinder>
      ))}
      
      {/* Mass */}
      <Box ref={massRef} args={[0.6, 0.6, 0.6]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#00e5ff" />
      </Box>
    </group>
  );
});

const FrictionSimulation = React.forwardRef(({ isPlaying }, ref) => {
  const blockRef = useRef();
  
  useFrame((state) => {
    if (!isPlaying || !blockRef.current) return;
    
    const time = state.clock.elapsedTime;
    const position = Math.sin(time * 0.5) * 2;
    
    blockRef.current.position.x = position;
  });

  return (
    <group ref={ref}>
      {/* Surface */}
      <Box args={[8, 0.2, 2]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#64748b" />
      </Box>
      
      {/* Block */}
      <Box ref={blockRef} args={[0.8, 0.8, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ff6f3c" />
      </Box>
      
      {/* Friction arrows */}
      <Cylinder args={[0.05, 0.05, 0.5]} position={[-1, 0.5, 0]} rotation={[0, 0, Math.PI/2]}>
        <meshStandardMaterial color="#ef4444" />
      </Cylinder>
    </group>
  );
});

const InclineSimulation = React.forwardRef(({ isPlaying }, ref) => {
  const ballRef = useRef();
  
  useFrame((state) => {
    if (!isPlaying || !ballRef.current) return;
    
    const time = state.clock.elapsedTime;
    const progress = (time * 0.3) % 2;
    const x = progress > 1 ? 2 - progress * 2 : -progress * 2;
    const y = Math.abs(x) * 0.3;
    
    ballRef.current.position.set(x, y, 0);
  });

  return (
    <group ref={ref}>
      {/* Inclined plane */}
      <Box args={[4, 0.2, 1]} position={[0, 0, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Box>
      
      {/* Ball */}
      <Sphere ref={ballRef} args={[0.2]} position={[-2, 0.6, 0]}>
        <meshStandardMaterial color="#00e5ff" />
      </Sphere>
    </group>
  );
});

const LensSimulation = React.forwardRef(({ isPlaying }, ref) => {
  return (
    <group ref={ref}>
      {/* Lens */}
      <Cylinder args={[1, 1, 0.1]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#fbbf24" transparent opacity={0.7} />
      </Cylinder>
      
      {/* Light rays */}
      {Array.from({ length: 5 }, (_, i) => (
        <Box 
          key={i} 
          args={[0.02, 0.02, 4]} 
          position={[0, (i - 2) * 0.5, 0]}
        >
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.5} />
        </Box>
      ))}
      
      {/* Focal point */}
      <Sphere args={[0.1]} position={[0, 0, 2]}>
        <meshStandardMaterial color="#ff6f3c" emissive="#ff6f3c" emissiveIntensity={0.8} />
      </Sphere>
    </group>
  );
});

const MirrorSimulation = React.forwardRef(({ isPlaying }, ref) => {
  return (
    <group ref={ref}>
      {/* Mirror */}
      <Box args={[0.1, 3, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#e5e7eb" metalness={0.9} roughness={0.1} />
      </Box>
      
      {/* Incident rays */}
      <Box args={[0.02, 0.02, 2]} position={[-1, 0.5, 0]} rotation={[0, 0, 0.2]}>
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.5} />
      </Box>
      
      {/* Reflected rays */}
      <Box args={[0.02, 0.02, 2]} position={[1, 0.5, 0]} rotation={[0, 0, -0.2]}>
        <meshStandardMaterial color="#ff6f3c" emissive="#ff6f3c" emissiveIntensity={0.5} />
      </Box>
      
      {/* Focal point */}
      <Sphere args={[0.1]} position={[0, 0, -1.5]}>
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
      </Sphere>
    </group>
  );
});

export default SimulationScene;
