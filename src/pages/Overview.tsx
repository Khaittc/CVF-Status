import React from 'react';
import { useStatus } from '../context/StatusContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';

const COLORS = {
  green: '#10b981', // emerald-500
  blue: '#3b82f6', // blue-500
  yellow: '#f59e0b', // amber-500
  red: '#ef4444', // red-500
  gray: '#94a3b8', // slate-400
};

function getStatusColor(status: string) {
  if (status.includes('FROZEN') || status.includes('CONFIRMED') || status === 'UI_REVIEW_PASS') return COLORS.green;
  if (status.includes('READY')) return COLORS.blue;
  if (status.includes('PARTIAL') || status.includes('PROGRESS') || status === 'UI_PENDING') return COLORS.yellow;
  if (status.includes('NEEDS') || status === 'BLOCKED' || status === 'SPEC_REOPEN_REQUIRED') return COLORS.red;
  return COLORS.gray;
}

export function Overview() {
  const { state } = useStatus();

  // Metrics calculation
  const totalSpecs = state.specs.length;
  const frozenSpecs = state.specs.filter(s => s.status.includes('FROZEN') || s.status.includes('CONFIRMED')).length;
  const partialSpecs = state.specs.filter(s => s.status === 'PARTIAL').length;
  const needsDecisionSpecs = state.specs.filter(s => s.status.includes('NEEDS')).length;

  const totalUIs = state.uis.length;
  const frozenUIs = state.uis.filter(u => u.status.includes('FROZEN') || u.status === 'UI_REVIEW_PASS').length;
  const pendingUIs = state.uis.filter(u => u.status === 'UI_PENDING' || u.status.includes('DEFERRED')).length;
  
  const openDecisions = state.openItems.filter(o => !o.status.includes('FROZEN') && !o.status.includes('CONFIRMED') && !o.status.includes('SUPERSEDED')).length;

  // Chart Data preparation
  const specStatusCounts = state.specs.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const specChartData = Object.keys(specStatusCounts).map(key => ({ name: key, value: specStatusCounts[key], color: getStatusColor(key) }));

  const uiStatusCounts = state.uis.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const uiChartData = Object.keys(uiStatusCounts).map(key => ({ name: key, value: uiStatusCounts[key], color: getStatusColor(key) }));

  const openItemsByType = state.openItems.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const openItemsChartData = Object.keys(openItemsByType).map(key => ({ name: key, value: openItemsByType[key], color: getStatusColor(key) }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Info */}
      <Card className="bg-blue-900 text-white border-blue-800 shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">Tracked Project</div>
              <div className="font-medium text-lg leading-tight">{state.metadata.trackedProject}</div>
            </div>
            <div>
              <div className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">Current Phase</div>
              <div className="font-medium text-blue-50 leading-tight">{state.metadata.currentPhase}</div>
            </div>
            <div className="lg:col-span-2">
              <div className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">Current Focus</div>
              <div className="text-sm text-blue-100">{state.metadata.currentFocus}</div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-blue-800/50 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-blue-300 mr-2">Production Authority:</span>
              <Badge status={state.metadata.productionAuthority} className="bg-slate-800/50 text-white border-slate-700" />
            </div>
            <div>
              <span className="text-blue-300 mr-2">Prototype Promotion Default:</span>
              <Badge status={state.metadata.prototypePromotionDefault} className="bg-slate-800/50 text-white border-slate-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Total SPEC Domains</div>
            <div className="text-3xl font-bold text-slate-800 mt-2">{totalSpecs}</div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-600 font-medium">{frozenSpecs} Frozen/Confirmed</span> • {partialSpecs} Partial
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">SPEC Needs Decision</div>
            <div className="text-3xl font-bold text-red-600 mt-2">{needsDecisionSpecs}</div>
            <div className="text-xs text-slate-500 mt-1">Domains blocked or lacking info</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Total UI Modules</div>
            <div className="text-3xl font-bold text-slate-800 mt-2">{totalUIs}</div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-600 font-medium">{frozenUIs} Frozen</span> • {pendingUIs} Pending/Deferred
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Open Decisions / Items</div>
            <div className="text-3xl font-bold text-amber-600 mt-2">{openDecisions}</div>
            <div className="text-xs text-slate-500 mt-1">Total unresolved ambiguities</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CVF SPEC by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={specChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 10}} />
                <RechartsTooltip formatter={(value) => [value, 'Domains']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {specChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CVF UI by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uiChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 10}} />
                <RechartsTooltip formatter={(value) => [value, 'Modules']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {uiChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Open Items by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex justify-center items-center">
            {openItemsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={openItemsChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {openItemsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-sm">No open items</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-64 overflow-y-auto">
             {state.changelog.length > 0 ? (
               <div className="space-y-4">
                 {state.changelog.slice(0, 5).map((log, i) => (
                   <div key={i} className="flex gap-3">
                     <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                     <div>
                       <div className="text-sm font-medium text-slate-800">{log.summary}</div>
                       <div className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()} • {log.source}</div>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-sm text-slate-500 h-full flex items-center justify-center">
                 No recent updates recorded in local storage.
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
