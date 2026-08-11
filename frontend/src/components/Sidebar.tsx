import React from 'react';
import { LayoutDashboard, Network, BookOpen, AlertTriangle, Activity, Shield, Sparkles, ChevronRight } from 'lucide-react';

export type TabType = 'overview' | 'topology' | 'knowledge' | 'incidents' | 'health' | 'audit';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'topology', label: 'Topology & Graph', icon: <Network className="w-4 h-4" />, badge: 'ATLAS-026', badgeColor: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40' },
    { id: 'knowledge', label: 'RAG Knowledge Base', icon: <BookOpen className="w-4 h-4" />, badge: 'ATLAS-027', badgeColor: 'bg-indigo-950/60 text-indigo-400 border-indigo-800/40' },
    { id: 'incidents', label: 'Incident Triage (RCA)', icon: <AlertTriangle className="w-4 h-4" />, badge: 'Active', badgeColor: 'bg-amber-950/60 text-amber-400 border-amber-800/40' },
    { id: 'health', label: 'Health Checks', icon: <Activity className="w-4 h-4" />, badge: '4 Runbooks', badgeColor: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' },
    { id: 'audit', label: 'Audit & Governance', icon: <Shield className="w-4 h-4" />, badge: 'ATLAS-032', badgeColor: 'bg-purple-950/60 text-purple-400 border-purple-800/40' },
  ];

  return (
    <aside className="w-72 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex flex-col justify-between p-4 shrink-0 z-40">
      <div className="space-y-6">
        {/* Navigation Category Label */}
        <div className="px-3 py-1 flex items-center justify-between text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
          <span>OPERATIONS WORKSPACE</span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        </div>

        {/* Menu Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-transparent text-cyan-200 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 hover:border hover:border-slate-800/80'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-sm shadow-cyan-400" />
                )}

                <div className="flex items-center gap-3">
                  <span className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                  }`} />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Core Principle Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-xl space-y-2.5">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Core Principle</span>
        </div>
        <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
          "AI assists; accountable humans decide."
        </p>
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>POLICY GUARDRAIL</span>
          <span className="text-emerald-400 font-bold">ATLAS-047 PASS</span>
        </div>
      </div>
    </aside>
  );
};
