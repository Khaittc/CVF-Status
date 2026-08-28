import React from 'react';
import { useStatus } from '../context/StatusContext';
import { format } from 'date-fns';

export function Changelog() {
  const { state } = useStatus();
  
  const logs = state.changelog || [];

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Nhật ký cập nhật</h1>
        <p className="text-sm text-slate-500 mt-1">History of state changes and applied JSON updates.</p>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
        {logs.map((log) => (
          <div key={log.id} className="relative flex items-start">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border border-slate-300 shadow-sm shrink-0 z-10 text-slate-500">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
            </div>
            <div className="ml-6 w-full bg-white border border-slate-200 rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-800 text-lg">{log.summary}</h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  {log.id}
                </span>
              </div>
              <div className="text-sm text-slate-500 mb-4 flex gap-4">
                <span>{format(new Date(log.timestamp), 'PPpp')}</span>
                <span className="border-l border-slate-300 pl-4">Source: <span className="font-medium text-slate-700">{log.source}</span></span>
              </div>
              <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded font-mono whitespace-pre-wrap text-xs">
                {log.details}
              </div>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="ml-16 py-10 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
            No updates recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
