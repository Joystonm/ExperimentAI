import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RealisticSimulation from './RealisticSimulation';
import ElectricalPlayground from './ElectricalPlayground';

const ExperimentSimulation = ({ experiment, onBack }) => {
  // If it's the circuit experiment, render the ElectricalPlayground
  if (experiment.id === 'circuit') {
    return <ElectricalPlayground onBack={onBack} />;
  }

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [measurements, setMeasurements] = useState({});
  const [showConceptPanel, setShowConceptPanel] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState('');
  const [parameters, setParameters] = useState({});

  useEffect(() => {
    const prompts = {
      pendulum: "Real pendulum physics: d²θ/dt² = -(g/L)sin(θ) - (b/m)(dθ/dt). Adjust parameters to see changes!",
      spring: "Hooke's Law in action: F = -kx. Newton's 2nd Law: F = ma. Watch energy conservation!",
      incline: "Forces on incline: mg sin θ (down slope) vs μmg cos θ (friction up slope)",
      newton: "Newton's 2nd Law: F = ma. Change force or mass to see acceleration change!",
      lens: "Lens equation: 1/f = 1/do + 1/di. Adjust object distance to see image formation!",
      mirror: "Mirror equation: 1/f = 1/do + 1/di. Watch real vs virtual image formation!"
    };
    
    setCurrentPrompt(prompts[experiment.id] || "Observe real physics in action!");
    
    // Set default parameters for each experiment
    const defaultParams = {
      pendulum: { length: 2.0, mass: 1.0, damping: 0.05, initialAngle: Math.PI/6 },
      spring: { mass: 1.0, springConstant: 10.0, damping: 0.2, initialDisplacement: 0.5 },
      incline: { mass: 2.0, angle: 17, friction: 0.3 },
      newton: { mass: 2.0, force: 5.0 },
      lens: { objectDistance: 30, focalLength: 15 },
      mirror: { objectDistance: 30, focalLength: 20 }
    };
    
    setParameters(defaultParams[experiment.id] || {});
  }, [experiment.id]);

  const handleMeasurement = (data) => {
    setMeasurements(prev => ({ ...prev, ...data }));
  };

  const handleParameterChange = (param, value) => {
    setParameters(prev => ({ ...prev, [param]: parseFloat(value) }));
  };

  const conceptExplanations = {
    'Period': 'T = 2π√(L/g). Period depends only on length and gravity, not mass or amplitude!',
    'Frequency': 'f = 1/T. Number of oscillations per second. Higher frequency = faster motion.',
    'Damping': 'Air resistance causes exponential decay: e^(-bt/2m). Energy is lost but period stays constant.',
    'Energy Conservation': 'PE ↔ KE conversion. Total energy decreases only due to damping forces.',
    'Hooke\'s Law': 'F = -kx. Spring force is proportional to displacement. k = spring constant.',
    'Spring Constant': 'Stiffness measure. Higher k = stiffer spring = higher frequency oscillation.',
    'SHM': 'Simple Harmonic Motion: x(t) = A cos(ωt + φ) where ω = √(k/m).',
    'Energy Transfer': 'At max displacement: PE = max, KE = 0. At equilibrium: PE = 0, KE = max.',
    'Forces': 'Vector quantities causing acceleration. Net force determines motion via F = ma.',
    'Friction': 'f = μN. Opposes motion. Static friction prevents motion, kinetic friction during sliding.',
    'Acceleration': 'a = F/m. Rate of velocity change. Measured in m/s². Direction same as net force.',
    'Free Body Diagrams': 'Shows all forces on object. Essential for analyzing motion and equilibrium.',
    'Newton\'s Laws': '1st: Inertia (v = constant if F = 0). 2nd: F = ma. 3rd: Action-reaction pairs.',
    'Force': 'Push or pull causing acceleration. Measured in Newtons (N = kg⋅m/s²).',
    'Mass': 'Inertial property. Resistance to acceleration. More mass = less acceleration for same force.',
    'Refraction': 'Light bending at interfaces. Snell\'s Law: n₁sin θ₁ = n₂sin θ₂.',
    'Focal Length': 'Distance where parallel rays converge. Determines lens power: P = 1/f.',
    'Image Formation': 'Real images: light actually converges. Virtual images: appear to come from location.',
    'Ray Diagrams': 'Geometric construction showing light paths. Predicts image location and properties.',
    'Reflection': 'Light bouncing off surfaces. Law: angle of incidence = angle of reflection.',
    'Focal Point': 'Point where parallel rays converge after reflection. F = R/2 for spherical mirrors.',
    'Real Images': 'Formed by actual light convergence. Can be projected on screen. Usually inverted.',
    'Virtual Images': 'Formed by apparent light divergence. Cannot be projected. Usually upright.'
  };

  const renderParameterControls = () => {
    const controls = {
      pendulum: [
        { param: 'length', label: 'Length (m)', min: 0.5, max: 3.0, step: 0.1 },
        { param: 'mass', label: 'Mass (kg)', min: 0.1, max: 5.0, step: 0.1 },
        { param: 'damping', label: 'Damping', min: 0, max: 0.2, step: 0.01 },
        { param: 'initialAngle', label: 'Initial Angle (rad)', min: 0.1, max: 1.0, step: 0.05 }
      ],
      spring: [
        { param: 'mass', label: 'Mass (kg)', min: 0.1, max: 5.0, step: 0.1 },
        { param: 'springConstant', label: 'Spring Constant k', min: 1, max: 50, step: 1 },
        { param: 'damping', label: 'Damping', min: 0, max: 1.0, step: 0.05 },
        { param: 'initialDisplacement', label: 'Initial Displacement (m)', min: 0.1, max: 1.0, step: 0.1 }
      ],
      incline: [
        { param: 'mass', label: 'Mass (kg)', min: 0.5, max: 10.0, step: 0.5 },
        { param: 'angle', label: 'Angle (°)', min: 5, max: 45, step: 1 },
        { param: 'friction', label: 'Friction μ', min: 0, max: 1.0, step: 0.05 }
      ],
      newton: [
        { param: 'mass', label: 'Mass (kg)', min: 0.5, max: 10.0, step: 0.5 },
        { param: 'force', label: 'Applied Force (N)', min: 0, max: 20, step: 0.5 }
      ],
      lens: [
        { param: 'objectDistance', label: 'Object Distance (cm)', min: 5, max: 100, step: 1 },
        { param: 'focalLength', label: 'Focal Length (cm)', min: 5, max: 50, step: 1 }
      ],
      mirror: [
        { param: 'objectDistance', label: 'Object Distance (cm)', min: 5, max: 100, step: 1 },
        { param: 'focalLength', label: 'Focal Length (cm)', min: 5, max: 50, step: 1 }
      ]
    };

    const experimentControls = controls[experiment.id] || [];

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-gray-900">Interactive Parameters</h4>
        {experimentControls.map(({ param, label, min, max, step }) => (
          <div key={param} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={parameters[param] || min}
                onChange={(e) => handleParameterChange(param, e.target.value)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-mono text-gray-600 w-16">
                {(parameters[param] || min).toFixed(step < 1 ? 2 : 1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleConceptClick = (concept) => {
    setSelectedConcept(concept);
    setShowConceptPanel(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-medium transition-all duration-200"
            >
              <span className="text-lg">←</span>
              <span>Back to Dashboard</span>
            </button>
            
            <div className="border-l border-gray-300 pl-6">
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-2 text-2xl">{experiment.icon}</span>
                {experiment.title}
              </h1>
              <p className="text-gray-600 text-xs">{experiment.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 mr-32">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${
                isPlaying 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-4 border-t border-blue-100">
          <p className="text-blue-800 font-semibold text-xl">{currentPrompt}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Simulation Canvas */}
        <div className="flex-1 relative">
          <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[10, 15, 10]} intensity={1.8} />
            <pointLight position={[-10, 10, 5]} intensity={1} color="#87ceeb" />
            <spotLight position={[0, 20, 0]} intensity={1.2} color="#ffffff" />
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            
            <RealisticSimulation 
              experimentType={experiment.id} 
              isPlaying={isPlaying}
              onMeasurement={handleMeasurement}
              onPromptChange={setCurrentPrompt}
              parameters={parameters}
            />
          </Canvas>
        </div>

        {/* Right Panel */}
        <div className="w-96 bg-white border-l border-gray-200 shadow-xl overflow-y-auto">
          {/* Parameter Controls */}
          <div className="p-6 border-b border-gray-100">
            {renderParameterControls()}
          </div>

          {/* Live Data Panel */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              📊 Live Data
            </h3>
            
            {Object.keys(measurements).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(measurements).map(([key, value]) => (
                  <div key={key} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium text-sm">{key}</span>
                      <span className="text-xl font-bold text-blue-600 font-mono">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">⏱️</div>
                <p className="text-gray-500">Real-time measurements will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Concept Explanation Modal */}
      {showConceptPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{selectedConcept}</h3>
              <button
                onClick={() => setShowConceptPanel(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {conceptExplanations[selectedConcept]}
            </p>
            <button
              onClick={() => setShowConceptPanel(false)}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentSimulation;
