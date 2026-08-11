import React from 'react';
import { Activity, Play, CheckCircle2, Clock } from 'lucide-react';

export const HealthChecksPage: React.FC = () => {
  const checks = [
    { name: 'FC SAN Fabric Path Redundancy Audit', target: 'SAN Fabric A & B', frequency: 'Hourly', lastRun: '12 mins ago', status: 'Passed' },
    { name: 'PostgreSQL Database WAL Replication Lag', target: 'PG-CLUSTER-FINANCE', frequency: 'Every 5 mins', lastRun: '2 mins ago', status: 'Passed' },
    { name: 'Pure Storage SFP Optical Power Baseline', target: 'FA-P01 All Ports', frequency: 'Daily', lastRun: '4 hours ago', status: 'Passed' },
    { name: 'VMware ESXi Datastore Queue Saturation', target: 'ESX-PROD01 Cluster', frequency: 'Every 15 mins', lastRun: '7 mins ago', status: 'Passed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Scheduled Infrastructure Health & Diagnostics Engine (ATLAS-023)
          </h2>
          <p className="text-xs text-slate-400">
            Read-only C0/C1 scheduled assessment runbooks maintaining operational baselines without risky modifications.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 flex items-center gap-2">
          <Play className="w-3.5 h-3.5" /> Run Selected Health Suite
        </button>
      </div>

      <div className="space-y-3">
        {checks.map((c, idx) => (
          <div key={idx} className="glass-panel p-4 flex items-center justify-between hover:border-emerald-500/40">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100">{c.name}</h4>
                <div className="text-xs text-slate-400 font-mono">Target: {c.target} | Schedule: {c.frequency}</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="badge badge-emerald">{c.status}</span>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> {c.lastRun}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
