import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ExperimentCard from '../components/ExperimentCard';
import ExperimentSimulation from '../components/ExperimentSimulation';

const Physics = () => {
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const physicsExperiments = [
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
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (selectedExperiment) {
    return (
      <ExperimentSimulation 
        experiment={selectedExperiment}
        onBack={() => setSelectedExperiment(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-lab-bg">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-5xl md:text-6xl font-bold text-royal-blue mb-6 tracking-wide">
            Physics Experiments
          </h1>
          <p className="text-xl md:text-2xl text-dark-gray mb-4 font-light">
            3D Interactive Physics Simulations
          </p>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Explore fundamental physics concepts through realistic 3D simulations. Each experiment provides 
            hands-on learning with detailed explanations and real-time measurements.
          </p>
        </motion.div>

        {/* Experiment Categories */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-royal-blue text-white rounded-full text-sm font-medium">
              Mechanics
            </div>
            <div className="px-4 py-2 bg-emerald-green text-white rounded-full text-sm font-medium">
              Oscillations
            </div>
            <div className="px-4 py-2 bg-bright-orange text-white rounded-full text-sm font-medium">
              Optics
            </div>
          </div>
        </motion.div>

        {/* Experiment Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {physicsExperiments.map((experiment) => (
            <motion.div key={experiment.id} variants={itemVariants}>
              <ExperimentCard
                experiment={experiment}
                isHovered={hoveredCard === experiment.id}
                onHover={() => setHoveredCard(experiment.id)}
                onLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedExperiment(experiment)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mt-16 bg-white rounded-2xl shadow-xl p-8 md:p-12"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-dark-gray text-center mb-8">
            Why Choose 3D Physics Simulations?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-dark-gray mb-2">Realistic Physics</h3>
              <p className="text-gray-600">Accurate simulations based on real physics equations and principles</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-dark-gray mb-2">Data Collection</h3>
              <p className="text-gray-600">Measure and analyze data just like in a real laboratory</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-bright-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🔬</span>
              </div>
              <h3 className="text-xl font-semibold text-dark-gray mb-2">Interactive Learning</h3>
              <p className="text-gray-600">Manipulate variables and see immediate results in 3D space</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Physics;
