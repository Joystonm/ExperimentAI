import React, { createContext, useContext, useState } from 'react';

const LabContext = createContext();

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error('useLab must be used within a LabProvider');
  }
  return context;
};

export const LabProvider = ({ children }) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [labObjects, setLabObjects] = useState([]);
  const [experimentLogs, setExperimentLogs] = useState([]);

  const addObject = (object) => {
    setLabObjects(prev => [...prev, { ...object, id: Date.now() }]);
  };

  const removeObject = (id) => {
    setLabObjects(prev => prev.filter(obj => obj.id !== id));
  };

  const logExperiment = (action, data) => {
    const log = {
      timestamp: new Date().toISOString(),
      action,
      data
    };
    setExperimentLogs(prev => [...prev, log]);
  };

  const value = {
    selectedTool,
    setSelectedTool,
    labObjects,
    addObject,
    removeObject,
    experimentLogs,
    logExperiment
  };

  return (
    <LabContext.Provider value={value}>
      {children}
    </LabContext.Provider>
  );
};
