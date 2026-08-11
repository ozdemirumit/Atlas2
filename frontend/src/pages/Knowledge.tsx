import React, { useState } from 'react';
import { BookOpen, FileText, Search, Sparkles, Lock, ArrowRight } from 'lucide-react';

export const KnowledgePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'restricted' | 'internal'>('all');

  const packs = [
    { id: 1, title: 'Pure Storage Purity//FA Operational Guide', category: 'Storage', version: 'v6.4.x', chunks: 1420, access: 'Restricted (Engineering)', updated: '2026-08-01', description: 'Deep-dive CLI troubleshooting, NVMe-oF configuration, and non-disruptive firmware upgrade procedures.' },
    { id: 2, title: 'Brocade Fabric OS Administrator Manual', category: 'SAN Switch', version: 'v9.1.x', chunks: 980, access: 'Restricted (NOC)', updated: '2026-07-28', description: 'FC port zoning, SFP optical transceiver diagnostic thresholds, and trunking configuration.' },
    { id: 3, title: 'VMware vSphere 8 Core Troubleshooting', category: 'Hypervisor', version: 'v8.0u2', chunks: 2310, access: 'Internal Ops', updated: '2026-08-04', description: 'vMotion failures, APD/PDL storage condition resolution, and ESXi kernel panic analysis.' },
    { id: 4, title: 'PostgreSQL Enterprise HA Runbook', category: 'Database', version: 'v18.0', chunks: 640, access: 'Internal Ops', updated: '2026-08-09', description: 'Patroni failover procedures, WAL archive replication lag tuning, and autovacuum optimization.' },
  ];

  const filteredPacks = packs.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'restricted') return matchesSearch && p.access.includes('Restricted');
    if (activeTab === 'internal') return matchesSearch && p.access.includes('Internal');
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Governed RAG Knowledge Base (ATLAS-015 / ATLAS-027)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ingested vendor documentation, KB articles, and operational runbooks with strict ACL boundaries and provenance tracking.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="badge-pill badge-cyan">VECTOR DB: INDEXED</span>
          <span className="badge-pill badge-purple">5,350 CHUNKS</span>
        </div>
      </div>

      {/* RAG Query Input Bar */}
      <div className="atlas-glass-panel p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>QUERY GOVERNED OPERATIONAL KNOWLEDGE (SEMANTIC HYBRID SEARCH)</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor manuals, KB articles, APD/PDL error codes, and runbooks..."
              className="w-full bg-slate-950/90 text-xs text-slate-100 placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-indigo-500/50 font-sans"
            />
          </div>
          <button className="btn-primary text-xs shrink-0 w-full sm:w-auto">
            <span>Query RAG Index</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3 font-mono text-xs">
        <button 
          onClick={() => setActiveTab('all')} 
          className={`px-4 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'all' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'}`}
        >
          All Packs ({packs.length})
        </button>
        <button 
          onClick={() => setActiveTab('restricted')} 
          className={`px-4 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'restricted' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
        >
          Restricted Access ({packs.filter(p => p.access.includes('Restricted')).length})
        </button>
        <button 
          onClick={() => setActiveTab('internal')} 
          className={`px-4 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'internal' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
        >
          Internal Ops ({packs.filter(p => p.access.includes('Internal')).length})
        </button>
      </div>

      {/* Knowledge Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPacks.map((p) => (
          <div key={p.id} className="atlas-glass-panel p-6 space-y-4 hover:border-indigo-500/50 transition-all duration-200 group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">{p.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5 font-mono text-xs">
                    <span className="text-slate-400">{p.category}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-400 font-bold">{p.version}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {p.description}
            </p>

            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <span className="block text-[10px] text-slate-500">INDEXED CHUNKS</span>
                <span className="text-slate-200 font-bold">{p.chunks}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">ACL BOUNDARY</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-400" /> {p.access.split(' ')[0]}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-500">LAST UPDATED</span>
                <span className="text-slate-300">{p.updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
