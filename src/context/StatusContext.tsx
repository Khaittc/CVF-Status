import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState } from '../types';
import { seedData } from '../data';

interface StatusContextType {
  state: AppState;
  updateState: (newState: Partial<AppState>, logSummary: string, source: string) => void;
  undoLatest: () => boolean;
  resetToSeed: () => void;
  importState: (newState: AppState, sourceName?: string) => void;
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

  const undoLatest = (): boolean => {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) {
      try {
        setState(JSON.parse(backup));
        localStorage.removeItem(BACKUP_KEY);
        return true;
      } catch (e) {
        console.error("Failed to parse backup state", e);
        return false;
      }
    }
    return false;
  };

  const resetToSeed = () => {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
    setState(seedData);
  };

  const importState = (newState: AppState, sourceName = 'File Import') => {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
    const timestamp = new Date().toISOString();
    const newLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp,
      summary: `Imported full JSON state (${newState.specs?.length || 0} specs, ${newState.uis?.length || 0} UIs)`,
      source: sourceName,
      details: 'Full JSON backup restored into system state'
    };
    
    setState({
      ...newState,
      changelog: [newLogEntry, ...(newState.changelog || [])]
    });
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
