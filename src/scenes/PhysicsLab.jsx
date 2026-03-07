import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, Sphere, Cylinder } from '@react-three/drei';
import { useLab } from '../context/LabContext';

const PhysicsLab = () => {
  const { labObjects, selectedTool, addObject } = useLab();
  const labRef = useRef();

  const handleClick = (event) => {
    if (!selectedTool) return;
    
    const position = [
      event.point.x,
      event.point.y + 0.5,
      event.point.z
    ];

    addObject({
      type: selectedTool,
      position,
      rotation: [0, 0, 0]
    });
  };

  return (
    <group ref={labRef}>
      {/* Lab Table */}
      <Box
        args={[12, 0.3, 8]}
        position={[0, 0, 0]}
        onClick={handleClick}
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Lab Floor */}
      <Plane
        args={[30, 30]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2, 0]}
      >
        <meshStandardMaterial color="#f8fafc" />
      </Plane>

      {/* Background Elements */}
      <Box args={[0.5, 8, 12]} position={[-8, 4, 0]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Box>
      <Box args={[0.5, 8, 12]} position={[8, 4, 0]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Box>

      {/* Render Physics Objects */}
      {labObjects.map((obj) => (
        <PhysicsObject key={obj.id} object={obj} />
      ))}
    </group>
  );
};

const PhysicsObject = ({ object }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && object.type === 'pendulum') {
      // Simple pendulum animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  const getObjectMesh = () => {
    switch (object.type) {
      case 'pendulum':
        return (
          <group ref={meshRef} position={object.position}>
            {/* Pendulum string */}
            <Cylinder args={[0.02, 0.02, 2]} position={[0, 1, 0]}>
              <meshStandardMaterial color="#666" />
            </Cylinder>
            {/* Pendulum bob */}
            <Sphere args={[0.3]} position={[0, -1, 0]}>
              <meshStandardMaterial color="#dc2626" />
            </Sphere>
          </group>
        );
        
      case 'spring':
        return (
          <group position={object.position}>
            <Cylinder args={[0.3, 0.3, 0.1]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#374151" />
            </Cylinder>
            {/* Spring coils */}
            {Array.from({ length: 8 }, (_, i) => (
              <Cylinder key={i} args={[0.15, 0.15, 0.05]} position={[0, i * 0.1 + 0.1, 0]}>
                <meshStandardMaterial color="#10b981" />
              </Cylinder>
            ))}
          </group>
        );
        
      case 'mass':
        return (
          <Box args={[0.6, 0.6, 0.6]} position={object.position}>
            <meshStandardMaterial color="#3b82f6" />
          </Box>
        );
        
      case 'ramp':
        return (
          <Box args={[3, 0.2, 1]} position={object.position} rotation={[0, 0, -0.3]}>
            <meshStandardMaterial color="#f59e0b" />
          </Box>
        );
        
      case 'lens':
        return (
          <Cylinder args={[0.8, 0.8, 0.1]} position={object.position} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#06b6d4" transparent opacity={0.7} />
          </Cylinder>
        );
        
      case 'mirror':
        return (
          <Box args={[0.1, 1.5, 1]} position={object.position}>
            <meshStandardMaterial color="#e5e7eb" metalness={0.9} roughness={0.1} />
          </Box>
        );
        
      default:
        return (
          <Box args={[0.5, 0.5, 0.5]} position={object.position}>
            <meshStandardMaterial color="#6b7280" />
          </Box>
        );
    }
  };

  return getObjectMesh();
};

export default PhysicsLab;
