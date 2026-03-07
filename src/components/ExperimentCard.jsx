import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CardPreview from './CardPreview';

const ExperimentCard = ({ experiment, isHovered, onHover, onLeave, onClick }) => {
  return (
    <div
      className={`relative bg-white rounded-3xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-500 ${
        isHovered 
          ? 'transform scale-105 shadow-2xl shadow-royal-blue/20 border-royal-blue/30' 
          : 'hover:shadow-lg hover:border-gray-300 shadow-md'
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* 3D Preview */}
      <div className="h-56 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={isHovered} autoRotateSpeed={2} />
          <CardPreview type={experiment.id} isAnimated={isHovered} />
        </Canvas>
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${experiment.color} opacity-10`} />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-4xl mr-4">{experiment.icon}</span>
          <h3 className="text-xl font-bold text-dark-gray">{experiment.title}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {experiment.description}
        </p>

        {/* Concept Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {experiment.concepts?.slice(0, 2).map((concept) => (
            <span
              key={concept}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
            >
              {concept}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Interactive Simulation</span>
          <button
            className={`px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-300 ${
              isHovered 
                ? 'bg-gradient-to-r from-bright-orange to-orange-600 shadow-lg shadow-bright-orange/30 animate-pulse' 
                : 'bg-bright-orange hover:bg-orange-600'
            }`}
          >
            {isHovered ? '✨ Click to Explore' : 'Explore →'}
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-royal-blue/5 to-bright-orange/5 pointer-events-none rounded-3xl" />
      )}
    </div>
  );
};

export default ExperimentCard;
