import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState } from '../types';
import { seedData } from '../data';

interface StatusContextType {
  state: AppState;
  updateState: (newState: Partial<AppState>, logSummary: string, source: string) => void;
  undoLatest: () => void;
  resetToSeed: () => void;
  importState: (newState: AppState) => void;
}

const STORAGE_KEY = 'cvf_progress_console_state';
const BACKUP_KEY = 'cvf_progress_console_backup';

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export function StatusProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateState = (newState: Partial<AppState>, logSummary: string, source: string) => {
    // Save current state as backup
    localStorage.setItem(BACKUP_KEY, JSON.stringify(state));

    const timestamp = new Date().toISOString();
    const newLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp,
      summary: logSummary,
      source,
      details: 'JSON Update applied'
    };

    setState(prev => ({
      ...prev,
      ...newState,
      changelog: [newLogEntry, ...prev.changelog]
    }));
  };

  const undoLatest = () => {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) {
      try {
        setState(JSON.parse(backup));
        localStorage.removeItem(BACKUP_KEY);
        alert('Undo successful. Reverted to previous state.');
      } catch (e) {
        console.error("Failed to parse backup state", e);
        alert('Undo failed: invalid backup data.');
      }
    } else {
      alert('No backup available to undo.');
    }
  };

  const resetToSeed = () => {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
    setState(seedData);
  };

  const importState = (newState: AppState) => {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
    setState(newState);
  };

  if (!isLoaded) return null;

  return (
    <StatusContext.Provider value={{ state, updateState, undoLatest, resetToSeed, importState }}>
      {children}
    </StatusContext.Provider>
  );
}

export function useStatus() {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
}
