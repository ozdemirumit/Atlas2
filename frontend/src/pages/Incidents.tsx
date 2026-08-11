import React from 'react';
import { AlertTriangle, FileCheck, ArrowRight } from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            AI Root Cause & Change Impact Analysis (ATLAS-042 / ATLAS-044)
          </h2>
          <p className="text-xs text-slate-400">
            Explainable diagnostic summaries with evidence lineage, confidence ratings, and risk interruption estimates.
          </p>
        </div>
      </div>

      {/* Incident Card */}
      <div className="glass-panel p-6 space-y-6 border-l-4 border-l-amber-500">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="badge badge-amber">ACTIVE INVESTIGATION</span>
              <span className="font-mono text-xs text-slate-400">INC-2026-0810-01</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mt-1">
              Elevated Storage Latency on SAN LUN Vol_Finance_Data01
            </h3>
          </div>
          <div className="text-right font-mono">
            <div className="text-xs text-slate-400">Confidence Score</div>
            <div className="text-xl font-bold text-cyan-400">92% High</div>
          </div>
        </div>

        {/* Diagnostic Evidence Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Correlated Evidence Lineage</h4>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-mono">
              <li>FC Port 12/2 on Brocade Switch SW-01 reporting 420 CRC error frames/sec</li>
              <li>Pure Storage Array FA-P01 latency spiked to 18ms during IO burst</li>
              <li>ESXi Cluster ESX-PROD01 datastore queue depth saturation at 64</li>
            </ul>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Impact & Risk Assessment</h4>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span>Service Interruption Risk:</span> <span className="text-amber-400 font-bold font-mono">LOW (Redundant Path Active)</span></div>
              <div className="flex justify-between"><span>Estimated Remediation Duration:</span> <span className="text-cyan-400 font-bold font-mono">15 minutes</span></div>
              <div className="flex justify-between"><span>Rollback Strategy:</span> <span className="text-emerald-400 font-bold font-mono">Automatic Path Failback</span></div>
            </div>
          </div>
        </div>

        {/* AI Recommendation Candidate */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
            <span className="flex items-center gap-2 font-bold"><FileCheck className="w-4 h-4" /> Recommended Safe Action Plan (Candidate)</span>
            <span>Approval Level Required: C3 (Human Operations Lead)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Perform non-disruptive port reset on Brocade FC Port 12/2 and re-evaluate SFP transceiver optical power levels. All IO will failover smoothly across redundant Fabric B.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700">
              View Detailed Reasoning Summary
            </button>
            <button className="px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 flex items-center gap-1.5">
              Submit for Human C3 Approval <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
