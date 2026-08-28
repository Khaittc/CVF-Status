import React from 'react';
import { Sidebar } from './Sidebar';
import { ShieldAlert } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white border-b border-slate-200 shrink-0 h-14 flex items-center px-6 justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Progress percentage is indicative only. It is not CVF approval, production readiness or build authority.</span>
          </div>
          <div className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">
            INDEPENDENT TRACKER
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 text-slate-800 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
