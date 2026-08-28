import React from 'react';
import { useStatus } from '../context/StatusContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';
import { cn } from '../lib/utils';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';

export function Roadmap() {
  const { state } = useStatus();

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Lộ trình Dự án</h1>
        <p className="text-sm text-slate-500 mt-1">CVF phases and execution roadmap</p>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {state.roadmap.map((phase, index) => {
          const isActive = phase.status === 'IN_PROGRESS' || phase.status === 'READY';
          const isPast = phase.status === 'PASS';
          
          return (
            <div key={phase.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2",
                isActive ? "text-blue-600 border-blue-100" : isPast ? "text-emerald-500 border-emerald-100" : "text-slate-300"
              )}>
                {isPast ? <CheckCircle2 className="w-5 h-5" /> : isActive ? <Clock className="w-5 h-5 animate-pulse" /> : <Circle className="w-5 h-5" />}
              </div>
              
              <Card className={cn(
                "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:shadow-md transition-shadow",
                isActive ? "border-blue-300 shadow-blue-100/50" : ""
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={cn("font-bold text-lg", isActive ? "text-blue-900" : "text-slate-800")}>
                      {phase.name}
                    </h3>
                    <Badge status={phase.status} />
                  </div>
                  
                  {phase.purpose && (
                    <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded">
                      {phase.purpose}
                    </p>
                  )}

                  {phase.mainOutputs && phase.mainOutputs.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Key Outputs</div>
                      <ul className="space-y-1">
                        {phase.mainOutputs.map((out, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
