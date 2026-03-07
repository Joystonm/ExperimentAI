import React from 'react';
import { useLab } from '../context/LabContext';

const ToolSidebar = ({ activeTab }) => {
  const { selectedTool, setSelectedTool } = useLab();

  const motionTools = [
    { id: 'pendulum', name: 'Pendulum', icon: '🎯' },
    { id: 'spring', name: 'Spring', icon: '🌀' },
    { id: 'mass', name: 'Mass Block', icon: '📦' },
    { id: 'ramp', name: 'Inclined Plane', icon: '📐' },
    { id: 'lens', name: 'Convex Lens', icon: '🔍' },
    { id: 'mirror', name: 'Concave Mirror', icon: '🪞' }
  ];

  const circuitTools = [
    { id: 'battery', name: 'Battery', icon: '🔋' },
    { id: 'wire', name: 'Wire', icon: '🔌' },
    { id: 'bulb', name: 'Light Bulb', icon: '💡' },
    { id: 'switch', name: 'Switch', icon: '🔘' },
    { id: 'resistor', name: 'Resistor', icon: '⚡' },
    { id: 'capacitor', name: 'Capacitor', icon: '🔲' },
    { id: 'diode', name: 'Diode', icon: '🔺' },
    { id: 'led', name: 'LED', icon: '🔴' },
    { id: 'potentiometer', name: 'Potentiometer', icon: '🎛️' },
    { id: 'ground', name: 'Ground', icon: '⏚' },
    { id: 'motor', name: 'DC Motor', icon: '⚙️' },
    { id: 'voltmeter', name: 'Voltmeter', icon: '📊' }
  ];

  const tools = activeTab === 'motion' ? motionTools : circuitTools;
  const title = activeTab === 'motion' ? '3D Motion Tools' : '2D Circuit Components';

  return (
    <div className="w-72 bg-white border-r border-gray-200 p-4 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-600">
          {activeTab === 'motion' 
            ? 'Drag physics objects to explore motion & optics'
            : 'Build circuits by connecting components with wires'
          }
        </p>
      </div>
      
      <div className="space-y-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={`w-full flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedTool === tool.id
                ? activeTab === 'motion'
                  ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-md'
                  : 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-md'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
            }`}
          >
            <span className="text-3xl">{tool.icon}</span>
            <div className="text-left">
              <div className="font-semibold">{tool.name}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
        <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
            💾 Save Experiment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolSidebar;
