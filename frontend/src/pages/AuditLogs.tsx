import React, { useState } from 'react';
import { Shield, Search, Download, CheckCircle2, XCircle } from 'lucide-react';
import { AuditEvent } from '../types';

export const AuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ALLOWED' | 'DENIED'>('ALL');

  const events: AuditEvent[] = [
    { id: 'aud-001', timestamp: new Date().toISOString(), event_type: 'IDENTITY_READ', subject_id: 'local-operator', action: 'read_self_identity', status: 'ALLOWED', resource: '/api/v1/identity/me' },
    { id: 'aud-002', timestamp: new Date(Date.now() - 300000).toISOString(), event_type: 'HEALTH_CHECK', subject_id: 'system-scheduler', action: 'execute_scheduled_assessment', status: 'ALLOWED', resource: '/api/v1/health' },
    { id: 'aud-003', timestamp: new Date(Date.now() - 600000).toISOString(), event_type: 'POLICY_EVALUATION', subject_id: 'local-operator', action: 'request_c3_action', status: 'DENIED', resource: '/api/v1/connectors/pure/reset' },
    { id: 'aud-004', timestamp: new Date(Date.now() - 900000).toISOString(), event_type: 'RAG_QUERY', subject_id: 'local-operator', action: 'search_knowledge_base', status: 'ALLOWED', resource: '/api/v1/knowledge/query' },
  ];

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.subject_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.event_type.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'ALLOWED') return matchesSearch && e.status === 'ALLOWED';
    if (statusFilter === 'DENIED') return matchesSearch && e.status === 'DENIED';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Enterprise Audit & Policy Governance Log (ATLAS-032 / ADR-003)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable structured audit trail capturing all subject identity access, policy evaluations, and decision authorizations.
          </p>
        </div>
        <button className="btn-secondary text-xs">
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="atlas-glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter audit events by subject, action, or event type..."
            className="w-full bg-slate-950/80 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 outline-none focus:border-purple-500/50 font-sans"
          />
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <button 
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${statusFilter === 'ALL' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            All Events ({events.length})
          </button>
          <button 
            onClick={() => setStatusFilter('ALLOWED')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${statusFilter === 'ALLOWED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Allowed ({events.filter(e => e.status === 'ALLOWED').length})
          </button>
          <button 
            onClick={() => setStatusFilter('DENIED')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${statusFilter === 'DENIED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Denied ({events.filter(e => e.status === 'DENIED').length})
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="atlas-glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="atlas-table">
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>Event Type</th>
                <th>Subject ID</th>
                <th>Action Performed</th>
                <th>Resource Target</th>
                <th className="text-right">Audit Result</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {filteredEvents.map((e) => (
                <tr key={e.id}>
                  <td className="text-slate-400">{e.timestamp.replace('T', ' ').substring(0, 19)}</td>
                  <td className="font-bold text-cyan-400">{e.event_type}</td>
                  <td className="text-slate-200">{e.subject_id}</td>
                  <td className="text-slate-300">{e.action}</td>
                  <td className="text-slate-400">{e.resource || '-'}</td>
                  <td className="text-right">
                    <span className={`badge-pill ${e.status === 'ALLOWED' ? 'badge-emerald' : 'badge-rose'}`}>
                      {e.status === 'ALLOWED' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
