import React, { useState, useMemo } from 'react';
import { useStatus } from '../context/StatusContext';
import { Badge } from '../components/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Table';
import { Search, SlidersHorizontal, ChevronRight, X } from 'lucide-react';
import { SpecDomain } from '../types';
import { cn } from '../lib/utils';

export function SpecList() {
  const { state } = useStatus();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSpec, setSelectedSpec] = useState<SpecDomain | null>(null);

  const statuses = Array.from(new Set(state.specs.map(s => s.status)));

  const filteredSpecs = useMemo(() => {
    return state.specs.filter(spec => {
      const matchesSearch = 
        spec.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spec.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || spec.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [state.specs, searchTerm, statusFilter]);

  return (
    <div className="flex h-full gap-6">
      {/* Main Table Area */}
      <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300", selectedSpec ? "mr-96" : "")}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">CVF SPEC Domains</h1>
          <div className="text-sm text-slate-500">{filteredSpecs.length} domains</div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm theo domain hoặc summary..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-lg shadow-sm border border-slate-200">
          <Table className="h-full">
            <TableHeader className="sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="w-[200px]">Domain</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpecs.map(spec => (
                <TableRow 
                  key={spec.id} 
                  className={cn("cursor-pointer", selectedSpec?.id === spec.id && "bg-blue-50/50 hover:bg-blue-50/80")}
                  onClick={() => setSelectedSpec(spec)}
                >
                  <TableCell className="font-mono text-xs text-slate-500">{spec.id}</TableCell>
                  <TableCell className="font-medium text-slate-800">{spec.domain}</TableCell>
                  <TableCell>
                    <Badge status={spec.status} />
                  </TableCell>
                  <TableCell className="text-slate-600 truncate max-w-xs" title={spec.summary}>
                    {spec.summary}
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </TableCell>
                </TableRow>
              ))}
              {filteredSpecs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    No matching SPEC domains found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail Side Drawer */}
      {selectedSpec && (
        <div className="fixed right-0 top-14 bottom-0 w-96 bg-white border-l border-slate-200 shadow-xl overflow-y-auto z-20 transition-transform">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
            <h2 className="font-semibold text-lg text-slate-800 truncate pr-4">{selectedSpec.domain}</h2>
            <button 
              onClick={() => setSelectedSpec(null)}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Status</div>
              <Badge status={selectedSpec.status} className="text-sm px-3 py-1" />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Summary</div>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                {selectedSpec.summary}
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Next Action</div>
              <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded border border-blue-100 font-medium">
                {selectedSpec.nextAction}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Related UI Modules</div>
              <ul className="space-y-2">
                {state.uis.filter(ui => ui.relatedSpec === selectedSpec.domain || ui.relatedSpec.includes(selectedSpec.domain)).map(ui => (
                  <li key={ui.id} className="text-sm flex items-center justify-between">
                    <span className="text-slate-700">{ui.module}</span>
                    <Badge status={ui.status} />
                  </li>
                ))}
                {state.uis.filter(ui => ui.relatedSpec === selectedSpec.domain || ui.relatedSpec.includes(selectedSpec.domain)).length === 0 && (
                  <li className="text-sm text-slate-400 italic">No mapped UI modules</li>
                )}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Open Decisions</div>
              <ul className="space-y-3">
                {state.openItems.filter(item => item.domain === selectedSpec.domain).map(item => (
                  <li key={item.id} className="text-sm border border-amber-200 bg-amber-50 rounded p-3">
                    <div className="font-medium text-amber-900 mb-1">{item.question || item.decision}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-amber-700 font-mono">{item.id}</span>
                      <Badge status={item.status} className="bg-white border-amber-200" />
                    </div>
                  </li>
                ))}
                {state.openItems.filter(item => item.domain === selectedSpec.domain).length === 0 && (
                  <li className="text-sm text-slate-400 italic">No open decisions</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
