import React, { useRef } from 'react';
import { useStatus } from '../context/StatusContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Download, Copy, FileText, Upload, RefreshCcw, AlertTriangle } from 'lucide-react';
import { AppState } from '../types';

export function ExportImport() {
  const { state, importState, resetToSeed } = useStatus();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    alert("Đã copy JSON vào clipboard!");
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `cvf_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportMarkdown = () => {
    const md = [
      `# CVF Progress Snapshot - ${state.metadata.trackedProject}`,
      `**Date:** ${new Date().toISOString().slice(0,10)}`,
      `**Phase:** ${state.metadata.currentPhase}`,
      ``,
      `## 1. SPEC Status`,
      ...state.specs.map(s => `- **${s.domain}**: ${s.status} - ${s.summary}`),
      ``,
      `## 2. Open Decisions`,
      ...state.openItems.map(o => `- **${o.domain}**: ${o.question || o.decision} (${o.status})`),
      ``,
      `## 3. UI Prototype Status`,
      ...state.uis.map(u => `- **${u.module}**: ${u.status} (Demo: ${u.customerDemo})`)
    ].join('\n');

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `cvf_snapshot_${new Date().toISOString().slice(0,10)}.md`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.metadata || !parsed.specs || !parsed.uis) {
          throw new Error("Invalid schema");
        }
        if (window.confirm("Bạn có chắc muốn ghi đè toàn bộ dữ liệu bằng file này?")) {
          importState(parsed as AppState);
          alert("Import thành công!");
        }
      } catch (err) {
        alert("File JSON không hợp lệ hoặc sai cấu trúc.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("CẢNH BÁO: Hành động này sẽ xóa toàn bộ dữ liệu hiện tại và khôi phục về dữ liệu mẫu (Seed Data). Bạn có chắc chắn?")) {
      resetToSeed();
      alert("Đã khôi phục dữ liệu mẫu.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Export / Import</h1>
        <p className="text-sm text-slate-500 mt-1">Backup, restore, and snapshot your project status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              Xuất dữ liệu hiện tại để backup hoặc chia sẻ báo cáo nhanh.
            </p>
            <button onClick={handleExportJson} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
              <Download className="w-4 h-4" /> Download JSON Backup
            </button>
            <button onClick={handleExportMarkdown} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
              <FileText className="w-4 h-4" /> Export Review Snapshot (Markdown)
            </button>
            <button onClick={handleCopyCurrent} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
              <Copy className="w-4 h-4" /> Copy JSON to Clipboard
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import & Reset</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              Khôi phục dữ liệu từ file backup hoặc reset hệ thống về trạng thái ban đầu.
            </p>
            
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Upload className="w-4 h-4" /> Import Full JSON Backup
            </button>
            
            <div className="pt-6 mt-6 border-t border-slate-100">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-md mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <strong>Danger Zone:</strong> Resetting will overwrite all current progress with initial seed data.
                </div>
              </div>
              <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 shadow-sm transition-colors">
                <RefreshCcw className="w-4 h-4" /> Reset to Seed Data
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
