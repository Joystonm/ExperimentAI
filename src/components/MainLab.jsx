import React, { useState } from 'react';
import ExperimentDashboard from './ExperimentDashboard';
import ExperimentSimulation from './ExperimentSimulation';

const MainLab = () => {
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  return (
    <div className="h-screen bg-lab-bg">
      {selectedExperiment ? (
        <ExperimentSimulation 
          experiment={selectedExperiment}
          onBack={() => setSelectedExperiment(null)}
        />
      ) : (
        <ExperimentDashboard onSelectExperiment={setSelectedExperiment} />
      )}
    </div>
  );
};

export default MainLab;
