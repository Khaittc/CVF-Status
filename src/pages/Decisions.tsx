import React, { useState } from 'react';
import { useStatus } from '../context/StatusContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Table';
import { Badge } from '../components/Badge';
import { cn } from '../lib/utils';

export function Decisions() {
  const { state } = useStatus();
  const [activeTab, setActiveTab] = useState<'decisions' | 'open'>('open');

  const decisions = state.decisions || [];
  const openItems = state.openItems || [];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quyết định & Điểm mở</h1>
        <p className="text-sm text-slate-500 mt-1">Track architectural, business, and UI decisions</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-lg w-max mb-6">
        <button
          onClick={() => setActiveTab('decisions')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all",
            activeTab === 'decisions' ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Quyết định ({decisions.length})
        </button>
        <button
          onClick={() => setActiveTab('open')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all",
            activeTab === 'open' ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Điểm mở / Ambiguity ({openItems.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white rounded-lg shadow-sm border border-slate-200">
        <Table className="h-full">
          <TableHeader className="sticky top-0 z-10 shadow-sm bg-slate-50">
            {activeTab === 'decisions' ? (
              <TableRow>
                <TableHead className="w-[120px]">ID</TableHead>
                <TableHead className="w-[180px]">Domain</TableHead>
                <TableHead className="min-w-[300px]">Decision</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
              </TableRow>
            ) : (
              <TableRow>
                <TableHead className="w-[120px]">ID</TableHead>
                <TableHead className="w-[180px]">Domain</TableHead>
                <TableHead className="min-w-[300px]">Question / Ambiguity</TableHead>
                <TableHead className="w-[180px]">Status</TableHead>
                <TableHead className="w-[200px]">Review Trigger</TableHead>
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {activeTab === 'decisions' && decisions.map(d => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-xs text-slate-500">{d.id}</TableCell>
                <TableCell className="font-medium text-slate-800">{d.domain}</TableCell>
                <TableCell className="text-slate-700">{d.decision}</TableCell>
                <TableCell><Badge status={d.status} /></TableCell>
              </TableRow>
            ))}
            
            {activeTab === 'open' && openItems.map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs text-slate-500">{o.id}</TableCell>
                <TableCell className="font-medium text-slate-800">{o.domain}</TableCell>
                <TableCell className="text-slate-700">{o.question}</TableCell>
                <TableCell><Badge status={o.status} /></TableCell>
                <TableCell className="text-xs text-slate-600">{o.reviewTrigger}</TableCell>
              </TableRow>
            ))}

            {activeTab === 'decisions' && decisions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                  Chưa có quyết định nào được ghi nhận.
                </TableCell>
              </TableRow>
            )}
            
            {activeTab === 'open' && openItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  Không có điểm mở nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
