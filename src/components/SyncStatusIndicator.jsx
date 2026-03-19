import React from 'react';
import { usePowerSync } from '../context/PowerSyncContext';

const SyncStatusIndicator = () => {
  const { isConnected, isSyncing } = usePowerSync();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
      <div className={`w-2 h-2 rounded-full ${
        isSyncing ? 'bg-yellow-500 animate-pulse' : 
        isConnected ? 'bg-green-500' : 
        'bg-gray-400'
      }`}></div>
      <span className="text-gray-700">
        {isSyncing ? 'Syncing...' : isConnected ? 'Synced' : 'Offline'}
      </span>
    </div>
  );
};

export default SyncStatusIndicator;
