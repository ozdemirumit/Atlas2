import React from 'react';
import { LayoutDashboard, Network, BookOpen, AlertTriangle, Activity, Shield } from 'lucide-react';

export type TabType = 'overview' | 'topology' | 'knowledge' | 'incidents' | 'health' | 'audit';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'topology', label: 'Topology & Graph', icon: <Network className="w-4 h-4" />, badge: 'Graph' },
    { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen className="w-4 h-4" />, badge: 'RAG' },
    { id: 'incidents', label: 'Incident Triage', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'health', label: 'Health Checks', icon: <Activity className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit & Policy', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        <div className="px-3 py-2 text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
          OPERATIONS WORKSPACE
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Principle Footer */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-[11px] tracking-wide uppercase">
          <Shield className="w-3.5 h-3.5" />
          <span>Core Principle</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-300">
          "AI assists; accountable humans decide."
        </p>
      </div>
    </aside>
  );
};
