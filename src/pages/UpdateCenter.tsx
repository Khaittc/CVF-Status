import React, { useState } from 'react';
import { useStatus } from '../context/StatusContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Save, Undo2, Code2 } from 'lucide-react';
import { AppState } from '../types';

export function UpdateCenter() {
  const { state, updateState, undoLatest } = useStatus();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<AppState | null>(null);

  const handleValidate = () => {
    setError(null);
    setPreview(null);
    try {
      if (!jsonInput.trim()) throw new Error("JSON input is empty");
      const parsed = JSON.parse(jsonInput);
      
      // Basic schema validation check (could be more robust)
      if (!parsed.metadata || !parsed.specs || !parsed.uis) {
        throw new Error("Invalid schema: Missing required top-level properties (metadata, specs, uis)");
      }
      
      setPreview(parsed as AppState);
    } catch (err: any) {
      setError(err.message || "Invalid JSON");
    }
  };

  const handleApply = () => {
    if (preview) {
      updateState(preview, "Manual JSON Update Applied", "Operator");
      setJsonInput('');
      setPreview(null);
      alert("Update applied successfully!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Cập nhật trạng thái</h1>
        <p className="text-sm text-slate-500 mt-1">Paste JSON payload to update tracker state</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="bg-slate-50 flex justify-between items-center py-3">
            <CardTitle className="text-base flex items-center gap-2"><Code2 className="w-5 h-5 text-slate-500"/> JSON Input</CardTitle>
            <button onClick={undoLatest} className="text-sm flex items-center gap-1 text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-2 py-1 rounded">
              <Undo2 className="w-4 h-4" /> Undo Last Update
            </button>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <textarea
              className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-slate-900 text-slate-300"
              placeholder="Paste JSON status update here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              spellCheck={false}
            />
            {error && (
              <div className="p-3 bg-red-100 text-red-700 border-t border-red-200 text-sm font-mono">
                Error: {error}
              </div>
            )}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={handleValidate}
                disabled={!jsonInput.trim()}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-medium text-sm hover:bg-slate-300 disabled:opacity-50"
              >
                Validate & Preview
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[600px]">
          <CardHeader className="bg-slate-50 py-3">
            <CardTitle className="text-base">Changes Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto bg-slate-50/50">
            {preview ? (
              <div className="p-6 space-y-6">
                <div className="bg-white border border-emerald-200 rounded p-4">
                  <h4 className="font-semibold text-emerald-800 mb-2">Valid Schema</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>SPEC Domains: {preview.specs?.length || 0} (Current: {state.specs.length})</li>
                    <li>UI Modules: {preview.uis?.length || 0} (Current: {state.uis.length})</li>
                    <li>Decisions: {preview.decisions?.length || 0}</li>
                    <li>Open Items: {preview.openItems?.length || 0}</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                  Click 'Apply Update' to merge these changes. The current state will be backed up for undo.
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                Validate JSON to see preview
              </div>
            )}
          </CardContent>
          {preview && (
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
              <button 
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 shadow-sm"
              >
                <Save className="w-4 h-4" /> Apply Update
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
