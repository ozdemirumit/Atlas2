import React from 'react';
import { Shield } from 'lucide-react';
import { AuditEvent } from '../types';

export const AuditLogsPage: React.FC = () => {
  const events: AuditEvent[] = [
    { id: 'aud-001', timestamp: new Date().toISOString(), event_type: 'IDENTITY_READ', subject_id: 'local-operator', action: 'read_self_identity', status: 'ALLOWED', resource: '/api/v1/identity/me' },
    { id: 'aud-002', timestamp: new Date(Date.now() - 300000).toISOString(), event_type: 'HEALTH_CHECK', subject_id: 'system-scheduler', action: 'execute_scheduled_assessment', status: 'ALLOWED', resource: '/api/v1/health' },
    { id: 'aud-003', timestamp: new Date(Date.now() - 600000).toISOString(), event_type: 'POLICY_EVALUATION', subject_id: 'local-operator', action: 'request_c3_action', status: 'DENIED', resource: '/api/v1/connectors/pure/reset' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Enterprise Audit & Policy Governance Log (ATLAS-032 / ADR-003)
          </h2>
          <p className="text-xs text-slate-400">
            Immutable structured audit trail capturing all identity access, policy evaluations, and decision authorizations.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Event Type</th>
                <th className="p-3.5">Subject ID</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Resource</th>
                <th className="p-3.5 text-right">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 text-slate-400">{e.timestamp.replace('T', ' ').substring(0, 19)}</td>
                  <td className="p-3.5 font-bold text-cyan-400">{e.event_type}</td>
                  <td className="p-3.5 text-slate-200">{e.subject_id}</td>
                  <td className="p-3.5 text-slate-300">{e.action}</td>
                  <td className="p-3.5 text-slate-400">{e.resource || '-'}</td>
                  <td className="p-3.5 text-right">
                    <span className={`badge ${e.status === 'ALLOWED' ? 'badge-emerald' : 'badge-rose'}`}>
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
