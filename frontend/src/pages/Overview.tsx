import React from 'react';
import { Server, Database, ShieldAlert, Cpu, HardDrive, Network, CheckCircle2, Lock } from 'lucide-react';
import { SubjectIdentity, SystemHealth } from '../types';

interface OverviewProps {
  identity: SubjectIdentity | null;
  health: SystemHealth | null;
}

export const OverviewPage: React.FC<OverviewProps> = ({ identity, health }) => {
  const domains = [
    { title: 'SAN Storage Arrays', vendor: 'Dell PowerStore / Pure Storage', count: '4 Arrays', status: 'Healthy', icon: <HardDrive className="w-5 h-5 text-cyan-400" /> },
    { title: 'FC SAN Switches', vendor: 'Brocade / Cisco MDS', count: '8 Switches', status: 'Healthy', icon: <Network className="w-5 h-5 text-indigo-400" /> },
    { title: 'Virtualization Hosts', vendor: 'VMware ESXi / Proxmox', count: '32 Hosts', status: 'Healthy', icon: <Cpu className="w-5 h-5 text-emerald-400" /> },
    { title: 'Enterprise Databases', vendor: 'PostgreSQL / Oracle DB', count: '12 Instances', status: 'Healthy', icon: <Database className="w-5 h-5 text-amber-400" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 glass-panel-accent flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">Enterprise Infrastructure Workspace</h2>
            <span className="badge badge-cyan font-mono">STABLE BASELINE v1.0.0</span>
          </div>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            Project Atlas correlates heterogeneous enterprise infrastructure telemetry, vendor documentation,
            and operational history to assist engineers with root cause analysis and risk estimation.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-right font-mono">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Active Environment</div>
            <div className="text-sm font-bold text-cyan-400 capitalize">{health?.environment || 'development'}</div>
          </div>
        </div>
      </div>

      {/* Identity & Scope Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>OPERATOR IDENTITY</span>
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-slate-100">{identity?.display_name || 'Local Operator'}</div>
          <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 p-2 rounded border border-cyan-800/40">
            Subject: {identity?.subject_id || 'local-operator'}
          </div>
        </div>

        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PERMITTED CAPABILITY CLASS</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">Class C0 (Context Read)</div>
          <p className="text-xs text-slate-400 leading-normal">
            Direct AI access limited to read-only diagnostics. Destructive actions require C3+ approval workflows.
          </p>
        </div>

        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>POSTGRESQL DB BASELINE</span>
            <Server className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-slate-100">PostgreSQL 18 Profile</div>
          <div className="text-xs text-slate-400 font-mono">
            Status: <span className="text-emerald-400 font-bold">ACTIVE & MIGRATED</span>
          </div>
        </div>
      </div>

      {/* Infrastructure Domain Modules */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
          CONNECTED INFRASTRUCTURE DOMAINS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domains.map((d, idx) => (
            <div key={idx} className="glass-panel p-4 space-y-3 hover:border-cyan-500/40 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">{d.icon}</div>
                <span className="badge badge-emerald">{d.status}</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">{d.title}</h4>
                <p className="text-xs text-slate-400">{d.vendor}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Integrated Assets</span>
                <span className="text-cyan-300 font-bold">{d.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Governance & Safety Notice */}
      <div className="glass-panel p-5 border-l-4 border-l-amber-500 bg-amber-950/10 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <ShieldAlert className="w-4 h-4" />
          <span>Operational Safety Policy (ATLAS-047)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          AI generated recommendations are non-executable candidate plans. Every operational recommendation include evidence lineage, risk level, expected service interruption, and rollback instructions. No AI process may bypass policy rules.
        </p>
      </div>
    </div>
  );
};
