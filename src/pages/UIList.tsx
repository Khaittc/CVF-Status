import React, { useState, useMemo } from 'react';
import { useStatus } from '../context/StatusContext';
import { Badge } from '../components/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Table';
import { Search, SlidersHorizontal, ChevronRight, X } from 'lucide-react';
import { UIModule } from '../types';
import { cn } from '../lib/utils';

export function UIList() {
  const { state } = useStatus();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedUI, setSelectedUI] = useState<UIModule | null>(null);

  const statuses = Array.from(new Set(state.uis.map(s => s.status)));

  const filteredUIs = useMemo(() => {
    return state.uis.filter(ui => {
      const matchesSearch = 
        ui.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ui.relatedSpec.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || ui.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [state.uis, searchTerm, statusFilter]);

  return (
    <div className="flex h-full gap-6">
      <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300", selectedUI ? "mr-96" : "")}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">CVF UI Prototype Modules</h1>
          <div className="text-sm text-slate-500">{filteredUIs.length} modules</div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm theo module hoặc SPEC liên quan..." 
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
                <TableHead className="w-[220px]">Module / Screen</TableHead>
                <TableHead className="w-[180px]">UI Status</TableHead>
                <TableHead>Related SPEC</TableHead>
                <TableHead className="w-[120px]">Demo</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUIs.map(ui => (
                <TableRow 
                  key={ui.id} 
                  className={cn("cursor-pointer", selectedUI?.id === ui.id && "bg-blue-50/50 hover:bg-blue-50/80")}
                  onClick={() => setSelectedUI(ui)}
                >
                  <TableCell className="font-mono text-xs text-slate-500">{ui.id}</TableCell>
                  <TableCell className="font-medium text-slate-800">{ui.module}</TableCell>
                  <TableCell>
                    <Badge status={ui.status} />
                  </TableCell>
                  <TableCell className="text-slate-600 truncate max-w-[150px]" title={ui.relatedSpec}>
                    {ui.relatedSpec}
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded",
                      ui.customerDemo === 'Included' ? 'bg-emerald-100 text-emerald-800' :
                      ui.customerDemo === 'Placeholder' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-600'
                    )}>
                      {ui.customerDemo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </TableCell>
                </TableRow>
              ))}
              {filteredUIs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    No matching UI modules found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedUI && (
        <div className="fixed right-0 top-14 bottom-0 w-96 bg-white border-l border-slate-200 shadow-xl overflow-y-auto z-20 transition-transform">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
            <h2 className="font-semibold text-lg text-slate-800 truncate pr-4">{selectedUI.module}</h2>
            <button 
              onClick={() => setSelectedUI(null)}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">UI Status</div>
              <Badge status={selectedUI.status} className="text-sm px-3 py-1" />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Related SPEC Domain</div>
              <p className="text-sm text-slate-800 font-medium bg-slate-50 p-2 rounded border border-slate-200 inline-block">
                {selectedUI.relatedSpec}
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Next Action</div>
              <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded border border-blue-100 font-medium">
                {selectedUI.nextAction}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Customer Demo</div>
                <div className="text-sm font-medium">{selectedUI.customerDemo}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Module ID</div>
                <div className="text-sm font-mono text-slate-600">{selectedUI.id}</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Open UI Issues / Blockers</div>
               <div className="text-sm text-slate-400 italic p-4 text-center border border-dashed rounded">
                 No specific UI issues tracked separately yet. Check associated SPEC for functional blockers.
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
