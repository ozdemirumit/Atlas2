import React, { useEffect, useState } from 'react';
import { ShieldCheck, Server, User, Clock } from 'lucide-react';
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
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & System Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Project Atlas
            </h1>
            <p className="text-[10px] font-mono text-cyan-400/80 -mt-1 tracking-wide">
              ENTERPRISE AI INFRASTRUCTURE OPS
            </p>
          </div>
        </div>

        {/* Backend API Health Status */}
        <div className={`badge ${isHealthy ? 'badge-emerald' : 'badge-rose'} ml-4`}>
          <span className={`pulse-dot ${isHealthy ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <span>API: {health ? health.status.toUpperCase() : 'CONNECTING'}</span>
        </div>
      </div>

      {/* Operator Identity & Clock */}
      <div className="flex items-center gap-5 font-mono text-xs">
        {/* System Time */}
        <div className="flex items-center gap-2 text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{time || '12:00:00'} UTC</span>
        </div>

        {/* Capability Scope Badge */}
        <div className="flex items-center gap-2 text-indigo-300 bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-800/40">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>SCOPED CLASS:</span>
          <span className="font-bold text-cyan-400">{identity?.max_capability_class || 'C0'}</span>
        </div>

        {/* User Identity Pill */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">{identity?.display_name || 'Local Operator'}</div>
            <div className="text-[10px] text-slate-400 font-mono -mt-0.5">{identity?.subject_id || 'local-operator'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
