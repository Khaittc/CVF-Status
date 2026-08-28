import React, { useState } from 'react';
import { useStatus } from '../context/StatusContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Save, Undo2, Code2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { AppState } from '../types';
import { Link } from 'react-router-dom';

export function UpdateCenter() {
  const { state, updateState, undoLatest } = useStatus();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<AppState | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; title: string; message: string; showUndo?: boolean } | null>(null);

  const handleValidate = () => {
    setError(null);
    setPreview(null);
    try {
      if (!jsonInput.trim()) throw new Error("JSON input is empty");
      const parsed = JSON.parse(jsonInput);
      
      // Basic schema validation check
      if (!parsed.metadata || !parsed.specs || !parsed.uis) {
        throw new Error("Cấu trúc JSON không hợp lệ: Thiếu các trường bắt buộc (metadata, specs, uis)");
      }
      
      setPreview(parsed as AppState);
      setNotice({
        type: 'info',
        title: 'Đã kiểm tra cấu trúc JSON',
        message: 'JSON hợp lệ! Xem trước các thay đổi ở cột bên phải và bấm "Apply Update" để áp dụng.'
      });
    } catch (err: any) {
      setError(err.message || "Invalid JSON");
      setNotice({
        type: 'error',
        title: 'JSON không hợp lệ',
        message: err.message || 'Cú pháp JSON bị lỗi.'
      });
    }
  };

  const handleApply = () => {
    if (preview) {
      updateState(preview, "Manual JSON Update Applied", "Operator");
      const specCount = preview.specs?.length || 0;
      const uiCount = preview.uis?.length || 0;
      setJsonInput('');
      setPreview(null);
      setNotice({
        type: 'success',
        title: 'Cập nhật trạng thái thành công!',
        message: `Đã lưu trạng thái mới với ${specCount} SPEC domains và ${uiCount} UI modules vào hệ thống.`,
        showUndo: true
      });
    }
  };

  const handleUndo = () => {
    const success = undoLatest();
    if (success) {
      setNotice({
        type: 'success',
        title: 'Hoàn tác thành công',
        message: 'Hệ thống đã phục hồi trạng thái trước đó.'
      });
    } else {
      setNotice({
        type: 'error',
        title: 'Không thể hoàn tác',
        message: 'Không tìm thấy bản sao lưu dự phòng nào để hoàn tác.'
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cập nhật trạng thái</h1>
          <p className="text-sm text-slate-500 mt-1">Dán payload JSON để cập nhật nhanh trạng thái tracker</p>
        </div>

        <button 
          onClick={handleUndo} 
          className="self-start sm:self-auto text-sm flex items-center gap-1.5 text-slate-700 hover:text-blue-600 bg-white border border-slate-300 px-3 py-2 rounded-md shadow-xs transition-colors"
        >
          <Undo2 className="w-4 h-4" /> Hoàn tác cập nhật (Undo)
        </button>
      </div>

      {notice && (
        <div 
          className={`p-4 rounded-lg border flex items-start justify-between gap-4 ${
            notice.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : notice.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-start gap-3">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-semibold text-sm">{notice.title}</h4>
              <p className="text-sm mt-0.5 opacity-90">{notice.message}</p>
              {notice.showUndo && (
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={handleUndo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                  >
                    <Undo2 className="w-3.5 h-3.5" /> Hoàn tác thay đổi
                  </button>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                  >
                    Xem Tổng quan <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-slate-600 p-1">
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="bg-slate-50 flex justify-between items-center py-3 border-b border-slate-200">
            <CardTitle className="text-base flex items-center gap-2"><Code2 className="w-5 h-5 text-slate-500"/> JSON Input</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <textarea
              className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-slate-900 text-slate-300"
              placeholder="Dán nội dung JSON trạng thái vào đây..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              spellCheck={false}
            />
            {error && (
              <div className="p-3 bg-red-100 text-red-700 border-t border-red-200 text-sm font-mono">
                Lỗi: {error}
              </div>
            )}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={handleValidate}
                disabled={!jsonInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 disabled:opacity-50 shadow-xs transition-colors"
              >
                Kiểm tra & Xem trước (Validate & Preview)
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[600px]">
          <CardHeader className="bg-slate-50 py-3 border-b border-slate-200">
            <CardTitle className="text-base">Xem trước thay đổi (Preview)</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto bg-slate-50/50">
            {preview ? (
              <div className="p-6 space-y-6">
                <div className="bg-white border border-emerald-200 rounded-lg p-4 shadow-xs">
                  <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Cấu trúc JSON hợp lệ
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1.5">
                    <li>SPEC Domains: <strong className="text-slate-800">{preview.specs?.length || 0}</strong> (Hiện hành: {state.specs.length})</li>
                    <li>UI Modules: <strong className="text-slate-800">{preview.uis?.length || 0}</strong> (Hiện hành: {state.uis.length})</li>
                    <li>Decisions: <strong className="text-slate-800">{preview.decisions?.length || 0}</strong></li>
                    <li>Open Items: <strong className="text-slate-800">{preview.openItems?.length || 0}</strong></li>
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  Nhấn <strong>'Áp dụng cập nhật'</strong> để áp dụng các thay đổi này vào hệ thống. Trạng thái hiện tại sẽ tự động được sao lưu để bạn có thể hoàn tác (Undo).
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                Dán JSON và bấm 'Kiểm tra & Xem trước' để xem dữ liệu
              </div>
            )}
          </CardContent>
          {preview && (
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
              <button 
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" /> Áp dụng cập nhật (Apply Update)
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
