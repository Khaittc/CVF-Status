import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  MonitorPlay, 
  Grid2X2, 
  GitPullRequest, 
  Map, 
  History, 
  Upload, 
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStatus } from '../context/StatusContext';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { state } = useStatus();

  const navGroups = [
    {
      title: 'Tổng quan',
      items: [
        { label: 'Tổng quan', icon: LayoutDashboard, path: '/' }
      ]
    },
    {
      title: 'Theo dõi',
      items: [
        { label: 'CVF SPEC', icon: FileText, path: '/spec' },
        { label: 'CVF UI', icon: MonitorPlay, path: '/ui' },
        { label: 'Ma trận SPEC ↔ UI', icon: Grid2X2, path: '/matrix' }
      ]
    },
    {
      title: 'Quản trị CVF',
      items: [
        { label: 'Quyết định & Điểm mở', icon: GitPullRequest, path: '/decisions' },
        { label: 'Lộ trình', icon: Map, path: '/roadmap' },
        { label: 'Nhật ký cập nhật', icon: History, path: '/changelog' }
      ]
    },
    {
      title: 'Dữ liệu',
      items: [
        { label: 'Cập nhật trạng thái', icon: Upload, path: '/update' },
        { label: 'Export / Import', icon: Download, path: '/export' }
      ]
    }
  ];

  return (
    <aside className={cn(
      "bg-slate-900 text-slate-300 h-screen flex flex-col transition-all duration-300 relative border-r border-slate-800",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-slate-800 text-slate-400 p-1 rounded-full border border-slate-700 hover:text-white hover:bg-slate-700 z-10"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Header */}
      <div className={cn("p-4 border-b border-slate-800 overflow-hidden whitespace-nowrap", collapsed ? "px-2" : "px-4")}>
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-blue-500 shrink-0" />
          {!collapsed && (
            <div>
              <h1 className="font-bold text-white text-sm">CVF Progress Console</h1>
              <p className="text-[10px] text-slate-400">Spec, UI & Decision Tracking</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
            )}
            <ul className="space-y-1 px-2">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className={cn("p-4 border-t border-slate-800 text-xs text-slate-500 overflow-hidden whitespace-nowrap", collapsed && "text-center px-1")}>
        {!collapsed ? (
          <>
            <div className="mb-1 text-slate-400 font-medium truncate">Tracked:</div>
            <div className="truncate text-white mb-3" title={state.metadata.trackedProject}>{state.metadata.trackedProject}</div>
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="text-white">v{state.metadata.trackerVersion}</span>
            </div>
          </>
        ) : (
          <div title={`Tracked: ${state.metadata.trackedProject}\nVersion: v${state.metadata.trackerVersion}`}>
            v{state.metadata.trackerVersion}
          </div>
        )}
      </div>
    </aside>
  );
}
