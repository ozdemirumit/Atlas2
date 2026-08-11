import React, { useState } from 'react';
import { AlertTriangle, FileCheck, ArrowRight, ShieldCheck, CheckCircle2, Zap, AlertCircle, Check } from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const [approvalSubmitted, setApprovalSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              AI Root Cause & Change Impact Analysis (ATLAS-042 / ATLAS-044)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explainable diagnostic summaries with evidence lineage, confidence ratings, and service interruption estimates.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="badge-pill badge-amber">1 INCIDENT UNDER INVESTIGATION</span>
        </div>
      </div>

      {/* Incident Diagnostic Panel */}
      <div className="atlas-glass-panel p-8 space-y-6 border-l-4 border-l-amber-500">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="badge-pill badge-amber">ACTIVE INCIDENT</span>
              <span className="font-mono text-xs text-slate-400">INC-2026-0810-01</span>
              <span className="text-xs font-mono text-slate-500">• 14 minutes ago</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Elevated Storage Latency on FC SAN LUN Vol_Finance_Data01
            </h3>
          </div>
          
          {/* Confidence Rating Score Card */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-right font-mono shrink-0">
            <div className="text-[10px] text-slate-400 uppercase">AI Confidence Score</div>
            <div className="text-2xl font-black text-cyan-400 flex items-center gap-1.5 justify-end">
              <span>92%</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">HIGH</span>
            </div>
          </div>
        </div>

        {/* Evidence Lineage & Impact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Evidence Tree */}
          <div className="atlas-glass-card p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold uppercase">
              <span>Correlated Evidence Lineage</span>
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <ul className="text-xs space-y-3 font-mono">
              <li className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Brocade FC Switch SW-01
                </div>
                <div className="text-slate-300">FC Port 12/2 reporting 420 CRC error frames/sec</div>
              </li>
              <li className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Pure Storage FlashArray FA-P01
                </div>
                <div className="text-slate-300">Array IO latency spiked to 18ms during IO burst</div>
              </li>
              <li className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VMware ESXi Cluster PROD01
                </div>
                <div className="text-slate-300">Datastore queue depth saturation at 64</div>
              </li>
            </ul>
          </div>

          {/* Service Impact Breakdown */}
          <div className="atlas-glass-card p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold uppercase">
              <span>Service Impact & Risk Assessment</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex justify-between items-center">
                <span className="text-slate-400">Service Interruption Risk:</span>
                <span className="badge-pill badge-emerald">LOW (Redundant Path Active)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex justify-between items-center">
                <span className="text-slate-400">Estimated Duration:</span>
                <span className="text-cyan-300 font-bold">15 Minutes</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex justify-between items-center">
                <span className="text-slate-400">Rollback Strategy:</span>
                <span className="text-emerald-400 font-bold">Automatic Path Failback</span>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Plan Action Proposal (Human Approval Required) */}
        <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <FileCheck className="w-4 h-4" />
              <span>RECOMMENDED SAFE ACTION PLAN (CANDIDATE ONLY)</span>
            </div>
            <span className="badge-pill badge-purple">Approval Required: Class C3 (Human Lead)</span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            Perform non-disruptive port reset on Brocade FC Port 12/2 and re-evaluate SFP transceiver optical power levels. All SAN IO will failover smoothly across redundant Fabric B path.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button className="btn-secondary text-xs w-full sm:w-auto">
              View Detailed Reasoning Trace
            </button>
            <button 
              onClick={() => setApprovalSubmitted(true)}
              className={`btn-primary text-xs w-full sm:w-auto ${approvalSubmitted ? 'bg-emerald-600 border-emerald-500' : ''}`}
            >
              {approvalSubmitted ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Submitted to C3 Human Queue!</span>
                </>
              ) : (
                <>
                  <span>Submit for Human C3 Approval</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
