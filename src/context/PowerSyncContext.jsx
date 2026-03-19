import React, { createContext, useContext, useEffect, useState } from 'react';
import { powerSyncDb, initPowerSync, disconnectPowerSync, clearPowerSync } from '../lib/powersync/db';
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

      const checkStatus = () => {
        const status = powerSyncDb.currentStatus;
        setIsSyncing(status?.connected && status?.downloading);
      };

      const interval = setInterval(checkStatus, 1000);

      return () => {
        clearInterval(interval);
        disconnectPowerSync(); // just disconnect, keep local data intact
        setIsConnected(false);
      };
    } else {
      // user logged out — wipe local DB
      clearPowerSync();
      setIsConnected(false);
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
