import React, { useState } from 'react';
import { Activity, Play, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

export const HealthChecksPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);

  const checks = [
    { id: 1, name: 'FC SAN Fabric Path Redundancy Audit', target: 'SAN Fabric A & B', frequency: 'Hourly', lastRun: '12 mins ago', status: 'Passed', duration: '1.2s' },
    { id: 2, name: 'PostgreSQL Database WAL Replication Lag', target: 'PG-CLUSTER-FINANCE', frequency: 'Every 5 mins', lastRun: '2 mins ago', status: 'Passed', duration: '0.4s' },
    { id: 3, name: 'Pure Storage SFP Optical Power Baseline', target: 'FA-P01 All Ports', frequency: 'Daily', lastRun: '4 hours ago', status: 'Passed', duration: '3.1s' },
    { id: 4, name: 'VMware ESXi Datastore Queue Saturation', target: 'ESX-PROD01 Cluster', frequency: 'Every 15 mins', lastRun: '7 mins ago', status: 'Passed', duration: '0.8s' },
  ];

  const handleRunSuite = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Scheduled Infrastructure Health & Diagnostics Engine (ATLAS-023)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Read-only C0/C1 scheduled assessment runbooks maintaining operational baselines without risky modifications.
          </p>
        </div>
        <button 
          onClick={handleRunSuite}
          className="btn-primary text-xs"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Running Health Checks...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Run All Health Runbooks</span>
            </>
          )}
        </button>
      </div>

      {/* Health Diagnostic Checks List */}
      <div className="space-y-4">
        {checks.map((c) => (
          <div 
            key={c.id} 
            className="atlas-glass-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 shadow-md shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-100">{c.name}</h4>
                <div className="text-xs text-slate-400 font-mono">
                  Target: <span className="text-slate-200">{c.target}</span> | Schedule: <span className="text-cyan-400">{c.frequency}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 font-mono text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase">Execution Time</div>
                <div className="text-slate-300 font-bold">{c.duration}</div>
              </div>
              <div className="text-right">
                <span className="badge-pill badge-emerald">{c.status}</span>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3 text-slate-500" /> {c.lastRun}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
