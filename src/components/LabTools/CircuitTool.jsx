import React, { useState } from 'react';
import { useLab } from '../../context/LabContext';

const CircuitTool = () => {
  const { logExperiment } = useLab();
  const [circuitState, setCircuitState] = useState({
    isComplete: false,
    hasShortCircuit: false,
    bulbLit: false
  });

  const analyzeCircuit = (objects) => {
    const batteries = objects.filter(obj => obj.type === 'battery');
    const bulbs = objects.filter(obj => obj.type === 'bulb');
    const wires = objects.filter(obj => obj.type === 'wire');

    // Simple circuit analysis
    const hasShortCircuit = batteries.length > 1 && wires.length < 2;
    const isComplete = batteries.length >= 1 && bulbs.length >= 1 && wires.length >= 2;
    const bulbLit = isComplete && !hasShortCircuit;

    const newState = { isComplete, hasShortCircuit, bulbLit };
    
    if (JSON.stringify(newState) !== JSON.stringify(circuitState)) {
      setCircuitState(newState);
      
      // Log experiment
      logExperiment('circuit_analysis', newState);
    }
  };

  return null; // This is a logic component, no visual rendering
};

export default CircuitTool;
