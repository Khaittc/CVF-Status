import React, { useMemo, useState } from 'react';
import { useStatus } from '../context/StatusContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Table';
import { Badge } from '../components/Badge';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

export function Matrix() {
  const { state } = useStatus();
  const [alignmentFilter, setAlignmentFilter] = useState('ALL');

  const matrixData = useMemo(() => {
    return state.specs.map(spec => {
      const relatedUIs = state.uis.filter(ui => ui.relatedSpec.includes(spec.domain));
      
      let alignment = 'NOT_MAPPED';
      if (relatedUIs.length > 0) {
        const specFrozen = spec.status.includes('FROZEN') || spec.status.includes('CONFIRMED');
        const uiFrozen = relatedUIs.some(ui => ui.status.includes('FROZEN') || ui.status === 'UI_REVIEW_PASS');
        
        if (specFrozen && uiFrozen) {
          alignment = 'ALIGNED';
        } else if (!specFrozen && uiFrozen) {
          alignment = 'UI_AHEAD_OF_SPEC';
        } else if (specFrozen && !uiFrozen) {
          alignment = 'SPEC_AHEAD_OF_UI';
        } else if (spec.status === 'PARTIAL' && uiFrozen) {
           alignment = 'SPEC_REOPEN_REQUIRED';
        } else {
           alignment = 'IN_PROGRESS';
        }
      }

      return {
        spec,
        uis: relatedUIs,
        alignment
      };
    }).filter(item => alignmentFilter === 'ALL' || item.alignment === alignmentFilter);
  }, [state.specs, state.uis, alignmentFilter]);

  const alignmentOptions = ['ALIGNED', 'UI_AHEAD_OF_SPEC', 'SPEC_AHEAD_OF_UI', 'SPEC_REOPEN_REQUIRED', 'IN_PROGRESS', 'NOT_MAPPED'];

  const getAlignmentStyle = (align: string) => {
    switch (align) {
      case 'ALIGNED': return 'bg-emerald-100 text-emerald-800';
      case 'UI_AHEAD_OF_SPEC': return 'bg-amber-100 text-amber-800 border border-amber-300';
      case 'SPEC_AHEAD_OF_UI': return 'bg-blue-100 text-blue-800';
      case 'SPEC_REOPEN_REQUIRED': return 'bg-red-100 text-red-800 font-bold border border-red-300';
      case 'IN_PROGRESS': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-500 italic';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ma trận SPEC ↔ UI</h1>
          <p className="text-sm text-slate-500 mt-1">Check alignment between Functional Specifications and UI Prototypes</p>
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={alignmentFilter}
            onChange={(e) => setAlignmentFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white font-medium"
          >
            <option value="ALL">All Alignments</option>
            {alignmentOptions.map(opt => (
              <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-white rounded-lg shadow-sm border border-slate-200">
        <Table className="h-full">
          <TableHeader className="sticky top-0 z-10 shadow-sm">
            <TableRow>
              <TableHead className="w-[250px] bg-slate-50">SPEC Domain</TableHead>
              <TableHead className="w-[180px] bg-slate-50 border-r border-slate-200">SPEC Status</TableHead>
              <TableHead className="w-[250px] bg-slate-50">UI Module</TableHead>
              <TableHead className="w-[180px] bg-slate-50 border-r border-slate-200">UI Status</TableHead>
              <TableHead className="w-[200px] bg-slate-50">Alignment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrixData.map((row, i) => (
              <TableRow key={row.spec.id}>
                <TableCell className="font-medium text-slate-800 align-top pt-4">
                  {row.spec.domain}
                </TableCell>
                <TableCell className="align-top pt-4 border-r border-slate-100">
                  <Badge status={row.spec.status} />
                </TableCell>
                <TableCell className="align-top p-0">
                  {row.uis.length > 0 ? (
                    <div className="flex flex-col">
                      {row.uis.map((ui, idx) => (
                        <div key={ui.id} className={cn("px-4 py-3", idx > 0 && "border-t border-slate-100")}>
                          {ui.module}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-slate-400 italic text-xs">No UI mapped</div>
                  )}
                </TableCell>
                <TableCell className="align-top p-0 border-r border-slate-100">
                   {row.uis.length > 0 ? (
                    <div className="flex flex-col h-full">
                      {row.uis.map((ui, idx) => (
                        <div key={ui.id} className={cn("px-4 py-3 h-full flex items-start", idx > 0 && "border-t border-slate-100")}>
                          <Badge status={ui.status} />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell className="align-top pt-4">
                  <span className={cn("text-[11px] font-semibold px-2 py-1 rounded", getAlignmentStyle(row.alignment))}>
                    {row.alignment.replace(/_/g, ' ')}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {matrixData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  No records match the selected alignment filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
