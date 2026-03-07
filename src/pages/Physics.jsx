import React, { useState } from 'react';
import ExperimentCard from '../components/ExperimentCard';
import ExperimentSimulation from '../components/ExperimentSimulation';

const Physics = () => {
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  const physicsExperiments = [
    {
      id: 'pendulum',
      title: 'Pendulum Oscillation',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Measure time period, damping effects, and energy conservation',
      preview: 'Smooth pendulum motion with precise timing measurements',
      concepts: ['Period', 'Frequency', 'Damping', 'Energy Conservation']
    },
    {
      id: 'spring',
      title: 'Spring-Mass System',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      description: 'Explore Hooke\'s Law, spring constant, and harmonic motion',
      preview: 'Mass oscillating with realistic spring physics',
      concepts: ['Hooke\'s Law', 'Spring Constant', 'SHM', 'Energy Transfer']
    },
    {
      id: 'incline',
      title: 'Inclined Plane Motion',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      description: 'Study forces, friction, and acceleration on slopes',
      preview: 'Block sliding with realistic friction forces',
      concepts: ['Forces', 'Friction', 'Acceleration', 'Free Body Diagrams']
    },
    {
      id: 'newton',
      title: 'Newton\'s Laws Track',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      description: 'Demonstrate F=ma with carts, pulleys, and masses',
      preview: 'Interactive cart system showing F=ma',
      concepts: ['Newton\'s Laws', 'Force', 'Mass', 'Acceleration']
    },
    {
      id: 'lens',
      title: 'Convex Lens Optics',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      description: 'Ray diagrams, focal length, and image formation',
      preview: 'Light rays converging through realistic lens',
      concepts: ['Refraction', 'Focal Length', 'Image Formation', 'Ray Diagrams']
    },
    {
      id: 'mirror',
      title: 'Concave Mirror Bench',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      description: 'Optical bench setup for reflection experiments',
      preview: 'Professional optical bench with measurements',
      concepts: ['Reflection', 'Focal Point', 'Real Images', 'Virtual Images']
    }
  ];

  if (selectedExperiment) {
    return (
      <ExperimentSimulation 
        experiment={selectedExperiment}
        onBack={() => setSelectedExperiment(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
              Physics Lab
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Interactive 3D Physics Simulations
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore fundamental physics concepts through realistic 3D simulations. Each experiment provides 
              hands-on learning with detailed explanations and real-time measurements.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">
              Mechanics
            </span>
            <span className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">
              Oscillations
            </span>
            <span className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">
              Optics
            </span>
          </div>
        </div>
      </section>

      {/* Experiments Grid */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {physicsExperiments.map((experiment) => (
              <div
                key={experiment.id}
                onClick={() => setSelectedExperiment(experiment)}
                className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700">
                    {experiment.icon}
                  </div>
                  <button className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{experiment.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{experiment.description}</p>
                <div className="flex flex-wrap gap-2">
                  {experiment.concepts.slice(0, 3).map((concept, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Why Choose 3D Physics Simulations?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Realistic Physics</h3>
              <p className="text-gray-600 text-sm">Accurate simulations based on real physics equations and principles</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Collection</h3>
              <p className="text-gray-600 text-sm">Measure and analyze data just like in a real laboratory</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Learning</h3>
              <p className="text-gray-600 text-sm">Manipulate variables and see immediate results in 3D space</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-600">© 2026 ExperimentAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Physics;
