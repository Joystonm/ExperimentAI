import React, { useState } from 'react';
import ExperimentCard from './ExperimentCard';

const ExperimentDashboard = ({ onSelectExperiment }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const experiments = [
    {
      id: 'pendulum',
      title: 'Pendulum Oscillation',
      icon: '🎯',
      description: 'Measure time period, damping effects, and energy conservation',
      color: 'from-royal-blue to-blue-600',
      preview: 'Smooth pendulum motion with precise timing measurements',
      concepts: ['Period', 'Frequency', 'Damping', 'Energy Conservation']
    },
    {
      id: 'spring',
      title: 'Spring-Mass System',
      icon: '🌀',
      description: 'Explore Hooke\'s Law, spring constant, and harmonic motion',
      color: 'from-emerald-green to-green-600',
      preview: 'Mass oscillating with realistic spring physics',
      concepts: ['Hooke\'s Law', 'Spring Constant', 'SHM', 'Energy Transfer']
    },
    {
      id: 'incline',
      title: 'Inclined Plane Motion',
      icon: '📦',
      description: 'Study forces, friction, and acceleration on slopes',
      color: 'from-bright-orange to-orange-600',
      preview: 'Block sliding with realistic friction forces',
      concepts: ['Forces', 'Friction', 'Acceleration', 'Free Body Diagrams']
    },
    {
      id: 'newton',
      title: 'Newton\'s Laws Track',
      icon: '📐',
      description: 'Demonstrate F=ma with carts, pulleys, and masses',
      color: 'from-purple-500 to-purple-700',
      preview: 'Interactive cart system showing F=ma',
      concepts: ['Newton\'s Laws', 'Force', 'Mass', 'Acceleration']
    },
    {
      id: 'lens',
      title: 'Convex Lens Optics',
      icon: '🔍',
      description: 'Ray diagrams, focal length, and image formation',
      color: 'from-yellow-500 to-bright-orange',
      preview: 'Light rays converging through realistic lens',
      concepts: ['Refraction', 'Focal Length', 'Image Formation', 'Ray Diagrams']
    },
    {
      id: 'mirror',
      title: 'Concave Mirror Bench',
      icon: '🪞',
      description: 'Optical bench setup for reflection experiments',
      color: 'from-indigo-500 to-royal-blue',
      preview: 'Professional optical bench with measurements',
      concepts: ['Reflection', 'Focal Point', 'Real Images', 'Virtual Images']
    },
    {
      id: 'circuit',
      title: 'Electrical Playground',
      icon: '⚡',
      description: '2D circuit builder with drag-and-drop components',
      color: 'from-yellow-400 to-orange-500',
      preview: 'Build and test real circuits with live feedback',
      concepts: ['Ohm\'s Law', 'Current', 'Voltage', 'Resistance', 'Power']
    }
  ];

  return (
    <div className="min-h-screen bg-lab-bg">
      {/* Header */}
      <div className="p-12 text-center">
        <h1 className="text-7xl font-bold text-royal-blue mb-6 tracking-wide">
          VirtuLab AI
        </h1>
        <p className="text-3xl text-dark-gray mb-4 font-light">
          Realistic 3D Physics Experiments
        </p>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
          Select an experiment to explore physics concepts with realistic simulations and interactive learning
        </p>
      </div>

      {/* Experiment Grid */}
      <div className="px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {experiments.map((experiment) => (
            <ExperimentCard
              key={experiment.id}
              experiment={experiment}
              isHovered={hoveredCard === experiment.id}
              onHover={() => setHoveredCard(experiment.id)}
              onLeave={() => setHoveredCard(null)}
              onClick={() => onSelectExperiment(experiment)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center p-8 border-t border-gray-200 bg-white">
        <p className="text-gray-600 mb-2 text-lg">
          VirtuLab - Interactive Physics & Electrical Simulations
        </p>
        <p className="text-gray-500">
          Learn through hands-on experimentation in a virtual laboratory
        </p>
      </div>
    </div>
  );
};

export default ExperimentDashboard;
