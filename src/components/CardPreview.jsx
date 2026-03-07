import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder } from '@react-three/drei';

const CardPreview = ({ type, isAnimated }) => {
  const groupRef = useRef();
  const pendulumRef = useRef();
  const springRef = useRef();

  useFrame((state) => {
    if (!isAnimated) return;

    const time = state.clock.elapsedTime;

    switch (type) {
      case 'pendulum':
        if (pendulumRef.current) {
          pendulumRef.current.rotation.z = Math.sin(time * 2) * 0.6;
        }
        break;
      case 'spring':
        if (springRef.current) {
          springRef.current.position.y = Math.sin(time * 3) * 0.3;
        }
        break;
      case 'friction':
        if (groupRef.current) {
          groupRef.current.position.x = Math.sin(time) * 0.5;
        }
        break;
      case 'incline':
        if (groupRef.current) {
          groupRef.current.rotation.y = time * 0.5;
        }
        break;
    }
  });

  const renderPreview = () => {
    switch (type) {
      case 'pendulum':
        return (
          <group ref={groupRef}>
            <Cylinder args={[0.02, 0.02, 1.5]} position={[0, 0.75, 0]} material-color="#64748b" />
            <group ref={pendulumRef} position={[0, 0, 0]}>
              <Sphere args={[0.2]} position={[0, -0.75, 0]} material-color="#00e5ff" />
            </group>
          </group>
        );

      case 'spring':
        return (
          <group ref={groupRef}>
            <Box args={[0.3, 0.1, 0.3]} position={[0, -0.5, 0]} material-color="#374151" />
            {Array.from({ length: 6 }, (_, i) => (
              <Cylinder 
                key={i} 
                args={[0.1, 0.1, 0.05]} 
                position={[0, -0.3 + i * 0.1, 0]} 
                material-color="#10b981" 
              />
            ))}
            <Box ref={springRef} args={[0.2, 0.2, 0.2]} position={[0, 0.3, 0]} material-color="#00e5ff" />
          </group>
        );

      case 'friction':
        return (
          <group ref={groupRef}>
            <Box args={[2, 0.1, 0.5]} position={[0, -0.3, 0]} material-color="#64748b" />
            <Box args={[0.3, 0.3, 0.3]} position={[0, 0, 0]} material-color="#ff6f3c" />
          </group>
        );

      case 'incline':
        return (
          <group ref={groupRef}>
            <Box args={[1.5, 0.1, 0.5]} position={[0, 0, 0]} rotation={[0, 0, -0.3]} material-color="#8b5cf6" />
            <Sphere args={[0.15]} position={[-0.3, 0.3, 0]} material-color="#00e5ff" />
          </group>
        );

      case 'lens':
        return (
          <group ref={groupRef}>
            <Cylinder args={[0.5, 0.5, 0.05]} rotation={[Math.PI/2, 0, 0]} material-color="#fbbf24" material-transparent material-opacity={0.7} />
            {/* Light rays */}
            <Box args={[0.02, 0.02, 1]} position={[-0.8, 0, 0]} material-color="#00e5ff" />
            <Box args={[0.02, 0.02, 1]} position={[0.8, 0, 0]} material-color="#00e5ff" />
          </group>
        );

      case 'mirror':
        return (
          <group ref={groupRef}>
            <Box args={[0.05, 1, 0.5]} position={[0, 0, 0]} material-color="#e5e7eb" material-metalness={0.9} />
            <Box args={[0.02, 0.02, 0.8]} position={[-0.5, 0, 0]} rotation={[0, 0, 0.2]} material-color="#00e5ff" />
            <Box args={[0.02, 0.02, 0.8]} position={[0.5, 0, 0]} rotation={[0, 0, -0.2]} material-color="#00e5ff" />
          </group>
        );

      default:
        return <Box args={[0.5, 0.5, 0.5]} material-color="#64748b" />;
    }
  };

  return renderPreview();
};

export default CardPreview;
