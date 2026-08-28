import React, { useState, useRef } from 'react';
import { useStatus } from '../context/StatusContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { 
  Download, 
  Copy, 
  FileText, 
  Upload, 
  RefreshCcw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileJson, 
  ArrowRight, 
  Undo2, 
  Check, 
  Layers, 
  Layout, 
  HelpCircle, 
  Sparkles 
} from 'lucide-react';
import { AppState } from '../types';
import { Link } from 'react-router-dom';

export function ExportImport() {
  const { state, importState, resetToSeed, undoLatest } = useStatus();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Staging state for uploaded file
  const [stagedFile, setStagedFile] = useState<{
    name: string;
    size: number;
    data: AppState;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // In-app notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    showUndo?: boolean;
  } | null>(null);

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const showNotice = (type: 'success' | 'error' | 'info', title: string, message: string, showUndo = false) => {
    setNotification({ type, title, message, showUndo });
  };

  const handleCopyCurrent = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(state, null, 2));
      setCopied(true);
      showNotice('success', 'Đã sao chép', 'Toàn bộ dữ liệu JSON đã được lưu vào clipboard của bạn.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showNotice('error', 'Lỗi sao chép', 'Không thể sao chép dữ liệu vào clipboard.');
    }
  };

  const handleExportJson = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchorNode = document.createElement('a');
      const filename = `cvf_backup_${state.metadata.trackedProject.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.json`;
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", filename);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      showNotice('success', 'Đã xuất file JSON', `File ${filename} đã được tải về máy của bạn.`);
    } catch {
      showNotice('error', 'Lỗi xuất file', 'Không thể tạo file JSON.');
    }
  };

  const handleExportMarkdown = () => {
    try {
      const md = [
        `# CVF Progress Snapshot - ${state.metadata.trackedProject}`,
        `**Date:** ${new Date().toISOString().slice(0,10)}`,
        `**Phase:** ${state.metadata.currentPhase}`,
        `**Tracker Version:** ${state.metadata.trackerVersion}`,
        ``,
        `## 1. SPEC Status Summary`,
        ...state.specs.map(s => `- **${s.domain}**: \`${s.status}\` - ${s.summary}`),
        ``,
        `## 2. UI Prototype Status`,
        ...state.uis.map(u => `- **${u.module}**: \`${u.status}\` (Demo: ${u.customerDemo})`),
        ``,
        `## 3. Open Decisions & Ambiguities`,
        ...state.openItems.map(o => `- **[${o.domain}]**: ${o.question || o.decision} (\`${o.status}\`)`),
        ``,
        `## 4. Confirmed Decisions`,
        ...state.decisions.map(d => `- **[${d.domain}]**: ${d.decision} (\`${d.status}\`)`)
      ].join('\n');

      const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
      const downloadAnchorNode = document.createElement('a');
      const filename = `cvf_snapshot_${new Date().toISOString().slice(0,10)}.md`;
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", filename);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      showNotice('success', 'Đã xuất file Markdown', `File ${filename} đã được tải về máy của bạn.`);
    } catch {
      showNotice('error', 'Lỗi xuất file', 'Không thể tạo file Markdown.');
    }
  };

  const processFile = (file: File) => {
    setFileError(null);
    setStagedFile(null);

    if (!file.name.endsWith('.json')) {
      setFileError('Chỉ hỗ trợ file định dạng JSON (.json). Vui lòng chọn lại.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        
        // Schema check
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Nội dung file không phải là đối tượng JSON hợp lệ.');
        }
        if (!parsed.metadata || !parsed.specs || !parsed.uis) {
          throw new Error('File JSON thiếu các thuộc tính bắt buộc (cần có: metadata, specs, uis).');
        }
        if (!Array.isArray(parsed.specs) || !Array.isArray(parsed.uis)) {
          throw new Error('Dữ liệu specs hoặc uis phải là danh sách mảng (Array).');
        }

        setStagedFile({
          name: file.name,
          size: file.size,
          data: parsed as AppState
        });
        showNotice('info', 'Đã tải file lên', `File "${file.name}" đã được kiểm tra cấu trúc hợp lệ. Hãy kiểm tra thông tin bên dưới và nhấn xác nhận.`);
      } catch (err: any) {
        setFileError(err.message || 'File JSON không hợp lệ hoặc bị lỗi cú pháp.');
      }
    };
    reader.onerror = () => {
      setFileError('Không thể đọc file từ thiết bị của bạn.');
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleConfirmImport = () => {
    if (!stagedFile) return;

    try {
      importState(stagedFile.data, `File: ${stagedFile.name}`);
      const fileName = stagedFile.name;
      const specCount = stagedFile.data.specs?.length || 0;
      const uiCount = stagedFile.data.uis?.length || 0;

      setStagedFile(null);
      setFileError(null);

      showNotice(
        'success',
        'Cập nhật dữ liệu thành công!',
        `Hệ thống đã nạp thành công ${specCount} SPEC domains và ${uiCount} UI modules từ "${fileName}". Dữ liệu đã được lưu trữ an toàn.`,
        true
      );
    } catch {
      showNotice('error', 'Lỗi nhập dữ liệu', 'Không thể áp dụng dữ liệu vào hệ thống.');
    }
  };

  const handleCancelStage = () => {
    setStagedFile(null);
    setFileError(null);
  };

  const handleExecuteReset = () => {
    resetToSeed();
    setShowResetConfirm(false);
    setStagedFile(null);
    setFileError(null);
    showNotice(
      'info',
      'Đã khôi phục dữ liệu mẫu',
      'Toàn bộ dữ liệu đã được đưa về trạng thái Seed Data ban đầu. Bạn có thể nhấn Hoàn tác nếu muốn quay lại.',
      true
    );
  };

  const handleUndo = () => {
    const success = undoLatest();
    if (success) {
      showNotice('success', 'Hoàn tác thành công', 'Hệ thống đã quay về trạng thái trước đó.');
    } else {
      showNotice('error', 'Không thể hoàn tác', 'Không tìm thấy bản sao lưu trạng thái trước đó.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Export / Import & Quản lý dữ liệu</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sao lưu dữ liệu, nạp bản backup JSON toàn diện và khôi phục trạng thái hệ thống
          </p>
        </div>

        <button
          onClick={handleUndo}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-sm transition-colors"
          title="Hoàn tác thay đổi gần nhất"
        >
          <Undo2 className="w-4 h-4" /> Hoàn tác trạng thái trước (Undo)
        </button>
      </div>

      {/* Global In-app Notification Banner */}
      {notification && (
        <div 
          className={`p-4 rounded-lg border flex items-start justify-between gap-4 transition-all duration-200 ${
            notification.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-start gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : notification.type === 'error' ? (
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <p className="text-sm mt-0.5 opacity-90">{notification.message}</p>
              
              {notification.showUndo && (
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={handleUndo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                  >
                    <Undo2 className="w-3.5 h-3.5" /> Hoàn tác thay đổi này
                  </button>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                  >
                    Xem Tổng quan Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Export Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Xuất dữ liệu (Export)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Tải xuống trạng thái hiện tại của dự án để lưu trữ ngoại tuyến hoặc gửi báo cáo cho nhóm.
              </p>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleExportJson} 
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-50/70 border border-blue-200 rounded-lg text-sm font-medium text-blue-800 hover:bg-blue-100/80 shadow-xs transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileJson className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">Tải file JSON Backup</div>
                      <div className="text-xs text-slate-500">Bản sao lưu đầy đủ để phục hồi</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-blue-600 group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button 
                  onClick={handleExportMarkdown} 
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-500" />
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">Xuất báo cáo Markdown</div>
                      <div className="text-xs text-slate-500">Bản tóm tắt định dạng .md cho tài liệu</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button 
                  onClick={handleCopyCurrent} 
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {copied ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-slate-500" />
                    )}
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">
                        {copied ? 'Đã sao chép vào Clipboard!' : 'Sao chép JSON vào Clipboard'}
                      </div>
                      <div className="text-xs text-slate-500">Copy nhanh chuỗi JSON dữ liệu</div>
                    </div>
                  </div>
                  {copied && (
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                      Copied!
                    </span>
                  )}
                </button>
              </div>

              {/* Current Stats Snapshot */}
              <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <div className="font-semibold text-slate-700">Dữ liệu hiện hành trên trình duyệt:</div>
                <div className="flex justify-between">
                  <span>Dự án:</span>
                  <span className="font-medium text-slate-800">{state.metadata.trackedProject}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng số SPEC Domains:</span>
                  <span className="font-medium text-slate-800">{state.specs.length} danh mục</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng số UI Modules:</span>
                  <span className="font-medium text-slate-800">{state.uis.length} module</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reset / Danger Zone Card */}
          <Card className="border-red-200 bg-red-50/20">
            <CardHeader className="border-b border-red-100 bg-red-50/40 pb-3">
              <CardTitle className="text-sm font-semibold text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Khu vực khôi phục hệ thống (Reset)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {!showResetConfirm ? (
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-red-700">
                    Khôi phục dữ liệu ban đầu từ kho mẫu (Seed Data).
                  </p>
                  <button 
                    onClick={() => setShowResetConfirm(true)} 
                    className="shrink-0 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded text-xs font-semibold hover:bg-red-50 shadow-xs"
                  >
                    <RefreshCcw className="w-3.5 h-3.5 inline mr-1" /> Reset về mẫu
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md space-y-3">
                  <div className="text-xs font-medium text-red-900">
                    Bạn có chắc muốn xóa các dữ liệu tùy chỉnh và trở về dữ liệu mẫu mặc định? (Hệ thống sẽ tự động lưu bản sao lưu dự phòng).
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleExecuteReset}
                      className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 shadow-xs"
                    >
                      Xác nhận khôi phục
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Import & Confirmation Center */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Nhập dữ liệu (Import Full JSON)
                </span>
                {stagedFile && (
                  <span className="text-xs font-normal px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> File hợp lệ
                  </span>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
              
              {/* File Upload / Dropzone Area */}
              <div>
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileInputChange} 
                />

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50/70 scale-[0.99]' 
                      : stagedFile
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      stagedFile ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {stagedFile ? (
                        <FileJson className="w-6 h-6" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {stagedFile ? stagedFile.name : 'Kéo thả file JSON vào đây hoặc bấm để chọn file'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {stagedFile 
                          ? `Dung lượng: ${(stagedFile.size / 1024).toFixed(1)} KB — Bấm vào đây nếu muốn chọn file khác`
                          : 'Hỗ trợ file cấu trúc JSON được xuất từ CVF Tracker'
                        }
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 shadow-xs"
                    >
                      {stagedFile ? 'Chọn file khác' : 'Chọn tệp từ thiết bị'}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {fileError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-sm text-red-800">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold">Lỗi cấu trúc tệp JSON:</div>
                      <div className="text-xs mt-1 text-red-700">{fileError}</div>
                    </div>
                    <button 
                      onClick={() => setFileError(null)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Đóng
                    </button>
                  </div>
                )}
              </div>

              {/* Staged File Confirmation & Preview View */}
              {stagedFile ? (
                <div className="border border-emerald-200 bg-white rounded-xl p-5 shadow-xs space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-sm text-slate-800">
                        Xác nhận nội dung sẽ cập nhật:
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      Phiên bản file: {stagedFile.data.metadata?.trackerVersion || 'N/A'}
                    </span>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                        <Layers className="w-3.5 h-3.5" /> SPEC
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {stagedFile.data.specs?.length || 0}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        (Hiện tại: {state.specs.length})
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                        <Layout className="w-3.5 h-3.5" /> UI Modules
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {stagedFile.data.uis?.length || 0}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        (Hiện tại: {state.uis.length})
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                        <Check className="w-3.5 h-3.5" /> Quyết định
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {stagedFile.data.decisions?.length || 0}
                      </div>
                      <div className="text-[11px] text-slate-500">Đã chốt</div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                        <HelpCircle className="w-3.5 h-3.5" /> Điểm mở
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {stagedFile.data.openItems?.length || 0}
                      </div>
                      <div className="text-[11px] text-slate-500">Cần làm rõ</div>
                    </div>
                  </div>

                  {/* Metadata preview */}
                  <div className="bg-slate-50 p-3.5 rounded-lg text-xs space-y-1.5 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tên dự án trong file:</span>
                      <span className="font-semibold text-slate-800">
                        {stagedFile.data.metadata?.trackedProject || 'Chưa định danh'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Giai đoạn dự án:</span>
                      <span className="font-medium text-slate-700">
                        {stagedFile.data.metadata?.currentPhase || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Trọng tâm hiện tại:</span>
                      <span className="font-medium text-slate-700">
                        {stagedFile.data.metadata?.currentFocus || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <strong>Lưu ý:</strong> Khi bạn nhấn <strong>"Xác nhận ghi đè & Nhập dữ liệu ngay"</strong>, dữ liệu trong ứng dụng sẽ được thay thế bằng file này. Trạng thái cũ sẽ tự động được lưu vào bản sao lưu để có thể Hoàn tác (Undo).
                  </div>

                  {/* Explicit Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={handleCancelStage}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleConfirmImport}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-500/20 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Xác nhận ghi đè & Nhập dữ liệu ngay
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-500 text-sm">
                  <p className="font-medium text-slate-600">Chưa có file nào được nạp</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Kéo thả hoặc chọn file .json phía trên để xem trước các chỉ số và bấm nút xác nhận cập nhật.
                  </p>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

