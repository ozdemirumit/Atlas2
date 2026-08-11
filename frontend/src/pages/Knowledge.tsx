import React from 'react';
import { BookOpen, FileText, Search } from 'lucide-react';

export const KnowledgePage: React.FC = () => {
  const packs = [
    { title: 'Pure Storage Purity//FA Operational Guide', version: 'v6.4.x', chunks: 1420, access: 'Restricted (Engineering)', updated: '2026-08-01' },
    { title: 'Brocade Fabric OS Administrator Manual', version: 'v9.1.x', chunks: 980, access: 'Restricted (NOC)', updated: '2026-07-28' },
    { title: 'VMware vSphere 8 Core Troubleshooting', version: 'v8.0u2', chunks: 2310, access: 'Internal Ops', updated: '2026-08-04' },
    { title: 'PostgreSQL Enterprise High-Availability Runbook', version: 'v18.0', chunks: 640, access: 'Internal Ops', updated: '2026-08-09' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Governed RAG Knowledge Base (ATLAS-015 / ATLAS-027)
          </h2>
          <p className="text-xs text-slate-400">
            Ingested vendor documentation, KB articles, and enterprise runbooks with provenance tracking and strict ACL boundaries.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="glass-panel p-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search vendor manuals, KB articles, and operational procedures with RAG..."
          className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none w-full font-sans"
        />
        <button className="px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/30">
          Query Index
        </button>
      </div>

      {/* Knowledge Packs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packs.map((p, idx) => (
          <div key={idx} className="glass-panel p-5 space-y-3 hover:border-indigo-500/40">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{p.title}</h4>
                  <span className="text-xs font-mono text-indigo-300">Target Version: {p.version}</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-xs font-mono text-slate-400">
              <div>
                <span className="block text-[10px] text-slate-500">INDEXED CHUNKS</span>
                <span className="text-slate-200 font-bold">{p.chunks}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">ACL BOUNDARY</span>
                <span className="text-cyan-400 font-bold">{p.access}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-500">LAST INDEXED</span>
                <span className="text-slate-300">{p.updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
