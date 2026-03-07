import React, { createContext, useContext, useEffect, useState } from 'react';
import { powerSyncDb, initPowerSync, disconnectPowerSync } from '../lib/powersync/db';
import { useAuth } from './AuthContext';

const PowerSyncContext = createContext();

export const usePowerSync = () => {
  const context = useContext(PowerSyncContext);
  if (!context) {
    throw new Error('usePowerSync must be used within PowerSyncProvider');
  }
  return context;
};

export const PowerSyncProvider = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (user) {
      initPowerSync().then(() => {
        setIsConnected(true);
      });

      // Listen to sync status
      const statusListener = powerSyncDb.registerListener({
        statusChanged: (status) => {
          setIsSyncing(status.connected && status.downloading);
        }
      });

      return () => {
        statusListener();
        disconnectPowerSync();
        setIsConnected(false);
      };
    }
  }, [user]);

  const value = {
    db: powerSyncDb,
    isConnected,
    isSyncing
  };

  return (
    <PowerSyncContext.Provider value={value}>
      {children}
    </PowerSyncContext.Provider>
  );
};
