import React, { useState } from 'react';
import { Server, Database, ShieldAlert, Cpu, HardDrive, Network, CheckCircle2, Lock, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';
import { SubjectIdentity, SystemHealth } from '../types';

interface OverviewProps {
  identity: SubjectIdentity | null;
  health: SystemHealth | null;
}

export const OverviewPage: React.FC<OverviewProps> = ({ identity, health }) => {
  const [filter, setFilter] = useState<'all' | 'healthy' | 'warning'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const domains = [
    { id: 1, title: 'SAN Storage Arrays', vendor: 'Pure Storage FlashArray //X90', count: '4 Arrays', status: 'Healthy', metric: '1.2ms Avg Latency', progress: 92, icon: <HardDrive className="w-5 h-5 text-cyan-400" /> },
    { id: 2, title: 'FC SAN Switches', vendor: 'Brocade G620 / Cisco MDS 9718', count: '8 Switches', status: 'Healthy', metric: '64 Gbps Line Rate', progress: 98, icon: <Network className="w-5 h-5 text-indigo-400" /> },
    { id: 3, title: 'Virtualization Clusters', vendor: 'VMware ESXi 8.0u2 / Proxmox VE', count: '32 Hosts', status: 'Healthy', metric: '68% CPU Load', progress: 85, icon: <Cpu className="w-5 h-5 text-emerald-400" /> },
    { id: 4, title: 'Enterprise DB Clusters', vendor: 'PostgreSQL 18 HA / Oracle RAC', count: '12 Instances', status: 'Healthy', metric: '99.99% Availability', progress: 99, icon: <Database className="w-5 h-5 text-amber-400" /> },
  ];

  const filteredDomains = filter === 'all' ? domains : domains.filter(d => d.status.toLowerCase() === filter);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome & Platform Banner */}
      <div className="atlas-glass-panel p-8 relative overflow-hidden">
        {/* Decorative ambient gradient circle */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-cyan-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="badge-pill badge-cyan">ATLAS-IMP-001 RUNNABLE BASELINE</span>
              <span className="text-xs font-mono text-slate-400">PostgreSQL 18 Profile Active</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              AI-Powered Infrastructure Operations Workspace
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Atlas correlates heterogeneous enterprise telemetry, vendor documentation, and operational history to assist engineers with explainable root cause analysis and safe change recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleRefresh}
              className="btn-secondary text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              Refresh Context
            </button>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-right font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">System State</div>
              <div className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5 justify-end">
                <span className="pulse-dot bg-emerald-400" />
                <span>{(health?.status || 'operational').toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Stat Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="atlas-glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>OPERATOR IDENTITY</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{identity?.display_name || 'Local Operator'}</div>
            <div className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-lg border border-cyan-800/40 inline-block mt-1">
              Subject: {identity?.subject_id || 'local-operator'}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Identity Provider</span>
            <span className="text-slate-200 font-mono">ADR-003 Development</span>
          </div>
        </div>

        <div className="atlas-glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CAPABILITY CLASS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">Class C0 (Context Read)</div>
            <p className="text-xs text-slate-400 mt-1 leading-normal">
              Direct AI tool access limited to read-only telemetry. C3-C5 operations require explicit human approval.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Policy Guardrail</span>
            <span className="text-emerald-400 font-mono font-bold">ATLAS-047 ENFORCED</span>
          </div>
        </div>

        <div className="atlas-glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>POSTGRESQL DB BASELINE</span>
            <Server className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">PostgreSQL 18 Profile</div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/40 inline-block mt-1">
              Status: Migrated Baseline v001
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Async Engine</span>
            <span className="text-indigo-300 font-mono font-bold">Psycopg 3.3.4</span>
          </div>
        </div>
      </div>

      {/* Connected Infrastructure Domains Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-extrabold text-slate-300 uppercase tracking-wider">
              INTEGRATED INFRASTRUCTURE DOMAINS
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              All ({domains.length})
            </button>
            <button 
              onClick={() => setFilter('healthy')} 
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${filter === 'healthy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              Healthy ({domains.filter(d => d.status === 'Healthy').length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredDomains.map((d) => (
            <div key={d.id} className="atlas-glass-panel p-5 space-y-4 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shadow-md group-hover:border-cyan-500/40 transition-colors">
                  {d.icon}
                </div>
                <span className="badge-pill badge-emerald">{d.status}</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>{d.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-slate-400 font-mono truncate">{d.vendor}</p>
              </div>

              {/* Metric Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">{d.count}</span>
                  <span className="text-cyan-300 font-bold">{d.metric}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500" 
                    style={{ width: `${d.progress}%` }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Policy Guarantee Banner */}
      <div className="atlas-glass-panel p-6 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-950/20 via-slate-900/50 to-slate-950/80 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-400 shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
            <span>Operational Decision-Support Guarantee (ATLAS-003 & ATLAS-047)</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            Atlas generates evidence-backed diagnostic hypotheses, risk scores, and candidate remediation runbooks. Every recommendation includes complete evidence lineage and estimated service impact. Operational changes are executed strictly by authorized human engineers.
          </p>
        </div>
      </div>
    </div>
  );
};
