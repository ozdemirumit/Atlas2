import React, { useEffect, useState } from 'react';
import { ShieldCheck, Server, User, Clock, Radio } from 'lucide-react';
import { SubjectIdentity, SystemHealth } from '../types';

interface HeaderProps {
  identity: SubjectIdentity | null;
  health: SystemHealth | null;
}

export const Header: React.FC<HeaderProps> = ({ identity, health }) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isHealthy = health?.status === 'healthy';

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Logo */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Server className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight gradient-text-cyan">
                PROJECT ATLAS
              </h1>
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                v1.0.0
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase -mt-0.5">
              AI Infrastructure Operations Platform
            </p>
          </div>
        </div>

        {/* Live System Health Badge */}
        <div className={`badge-pill ${isHealthy ? 'badge-emerald' : 'badge-rose'} ml-2 cursor-pointer`}>
          <span className={`pulse-dot ${isHealthy ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <span>API: {health ? health.status.toUpperCase() : 'CONNECTING'}</span>
        </div>
      </div>

      {/* Operator Identity Context & Telemetry Header */}
      <div className="flex items-center gap-4 font-mono text-xs">
        {/* System Time */}
        <div className="hidden lg:flex items-center gap-2 text-slate-400 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800/80 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{time || '12:00:00'} UTC</span>
        </div>

        {/* Active Environment */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800/80 text-slate-300">
          <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="text-[11px] uppercase font-semibold text-slate-400">ENV:</span>
          <span className="font-bold text-indigo-300 capitalize">{health?.environment || 'development'}</span>
        </div>

        {/* Capability Scope Pill (ADR-003) */}
        <div className="flex items-center gap-2 bg-indigo-950/40 border border-indigo-800/40 px-3.5 py-1.5 rounded-xl text-indigo-200">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span className="text-[11px] text-slate-400">SCOPE:</span>
          <span className="font-bold text-cyan-400">{identity?.max_capability_class || 'C0'}</span>
        </div>

        {/* Subject Operator Profile Badge */}
        <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-cyan-500/20">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-slate-200 text-xs">{identity?.display_name || 'Local Operator'}</div>
            <div className="text-[10px] text-cyan-400 font-mono -mt-0.5">{identity?.subject_id || 'local-operator'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
