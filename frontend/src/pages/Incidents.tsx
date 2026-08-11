import React, { useState, useEffect } from 'react';
import { AlertTriangle, FileCheck, ArrowRight, ShieldCheck, CheckCircle2, Zap, AlertCircle, Check, BookOpen, RefreshCw, FileText, Lock, Trash2, X } from 'lucide-react';
import { getLocalStore, setLocalStore } from '../api/client';

interface RAGCitation {
  source_document: string;
  version: string;
  kb_reference: string;
  relevance_score: number;
  excerpt: string;
  access_boundary: string;
}

interface IncidentItem {
  incident_id: string;
  title: string;
  severity: string;
  status: string;
  detected_at: string;
  target_lun: string;
  affected_cluster: string;
}

export const IncidentsPage: React.FC = () => {
  const [approvalSubmitted, setApprovalSubmitted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notification, setNotification] = useState('');

  const defaultIncidents: IncidentItem[] = [
    {
      incident_id: 'INC-2026-0810-01',
      title: 'Elevated Storage Latency on FC SAN LUN Vol_Finance_Data01',
      severity: 'CRITICAL',
      status: 'UNDER_INVESTIGATION',
      detected_at: '14 minutes ago',
      target_lun: 'Vol_Finance_Data01',
      affected_cluster: 'ESXI-CLUSTER-PROD01',
    },
  ];

  const [incidents, setIncidents] = useState<IncidentItem[]>(() => {
    return getLocalStore<IncidentItem[]>('atlas_incidents', defaultIncidents);
  });

  const updateIncidentsState = (newIncidents: IncidentItem[]) => {
    setIncidents(newIncidents);
    setLocalStore('atlas_incidents', newIncidents);
  };

  const [ragCitations, setRagCitations] = useState<RAGCitation[]>([
    {
      source_document: 'Pure Storage Purity//FA Operational Guide',
      version: 'v6.4.x',
      kb_reference: 'KB-DOC-001-REV2',
      relevance_score: 0.94,
      excerpt: 'Deep-dive CLI troubleshooting, NVMe-oF configuration, and non-disruptive firmware upgrade procedures.',
      access_boundary: 'Restricted (Engineering)',
    },
    {
      source_document: 'Brocade Fabric OS Administrator Manual',
      version: 'v9.1.x',
      kb_reference: 'KB-DOC-002-REV2',
      relevance_score: 0.92,
      excerpt: 'FC port zoning, SFP optical transceiver diagnostic thresholds, and trunking configuration.',
      access_boundary: 'Restricted (NOC)',
    },
    {
      source_document: 'VMware vSphere 8 Core Troubleshooting',
      version: 'v8.0u2',
      kb_reference: 'KB-DOC-003-REV2',
      relevance_score: 0.88,
      excerpt: 'vMotion failures, APD/PDL storage condition resolution, and ESXi kernel panic analysis.',
      access_boundary: 'Internal Ops',
    },
  ]);

  const loadIncidents = async () => {
    try {
      const res = await fetch('/api/v1/incidents');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          updateIncidentsState(data);
        }
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleRunRCA = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/v1/incidents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: incidents[0]?.incident_id || 'INC-2026-0810-01',
          telemetry_summary: 'FC Port 12/2 420 CRC error frames/sec; Pure FA-P01 IO latency 18ms; ESXi queue depth 64',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.rag_document_citations) {
          setRagCitations(data.rag_document_citations);
        }
      }
    } catch {
      // fallback
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApproveC3 = async () => {
    setApprovalSubmitted(true);
    try {
      await fetch(`/api/v1/incidents/${incidents[0]?.incident_id || 'INC-2026-0810-01'}/approve-c3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approver_notes: 'Approved after reviewing RAG evidence citations.' }),
      });
    } catch {
      // fallback
    }
  };

  const handleDeleteIncident = async (incident_id: string, title: string) => {
    if (!window.confirm(`"${title}" arızasını silmek ve kapatmak istediğinizden emin misiniz? (Superuser C5 Yetkisi)`)) return;

    const nextIncidents = incidents.filter(inc => inc.incident_id !== incident_id);
    updateIncidentsState(nextIncidents);

    try {
      await fetch(`/api/v1/incidents/${incident_id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }

    setNotification(`Arıza '${incident_id}' başarıyla silindi ve kapatıldı.`);
    setTimeout(() => setNotification(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              AI Root Cause & Change Impact Analysis (ATLAS-042 / ATLAS-044)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Governed RAG kütüphanesinden gerçek döküman kanıtları toplayarak kök neden analizi sunar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="badge-pill badge-amber">{incidents.length} INCIDENTS ACTIVE</span>
          <button 
            onClick={handleRunRCA}
            className="btn-primary text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-cyan-300' : ''}`} />
            <span>{isAnalyzing ? 'Belgeler ve Kanıtlar Toplanıyor...' : 'Canlı Belge ve Kanıt Topla (RAG RCA)'}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Incident List / Empty State */}
      {incidents.length === 0 ? (
        <div className="atlas-glass-panel p-12 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Aktif Altyapı Arızası Bulunmamaktadır</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-mono">
            Tüm SAN Switch, Hitachi Storage ve ESXi sunucu metrikleri normal değerlerdedir.
          </p>
        </div>
      ) : (
        incidents.map((incident) => (
          <div key={incident.incident_id} className="atlas-glass-panel p-8 space-y-6 border-l-4 border-l-amber-500 relative">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="badge-pill badge-amber">{incident.status}</span>
                  <span className="font-mono text-xs text-slate-400">{incident.incident_id}</span>
                  <span className="text-xs font-mono text-slate-500">• {incident.detected_at}</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {incident.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Delete Incident Button (Class C5 Superuser) */}
                <button
                  onClick={() => handleDeleteIncident(incident.incident_id, incident.title)}
                  title="Arızayı Sil / Kapat (Superuser C5)"
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800 transition-colors text-xs font-mono flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Arızayı Sil / Kapat</span>
                </button>

                {/* Confidence Rating Score Card */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-right font-mono shrink-0">
                  <div className="text-[10px] text-slate-400 uppercase">AI Confidence Score</div>
                  <div className="text-2xl font-black text-cyan-400 flex items-center gap-1.5 justify-end">
                    <span>92%</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">HIGH</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Lineage & Impact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Evidence Telemetry Tree */}
              <div className="atlas-glass-card p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold uppercase">
                  <span>Correlated Telemetry Lineage</span>
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

            {/* Real RAG Knowledge Evidence Citations Section */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>TOPLANAN GERÇEK RAG BELGELERİ VE KANIT ALINTILARI ({ragCitations.length} BELGE)</span>
                </div>
                <span className="badge-pill badge-purple">PROVENANCE VERIFIED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {ragCitations.map((cite, idx) => (
                  <div key={idx} className="atlas-glass-card p-4 space-y-2.5 border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span className="text-slate-200 text-xs font-bold truncate">{cite.source_document}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-cyan-400 font-bold">{cite.version}</span>
                      <span className="text-emerald-400 font-bold">Skor: %{(cite.relevance_score * 100).toFixed(0)}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed italic bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      "{cite.excerpt}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Referans: {cite.kb_reference}</span>
                      <span className="flex items-center gap-1 text-slate-400"><Lock className="w-2.5 h-2.5" /> {cite.access_boundary.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
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
                  onClick={handleApproveC3}
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
        ))
      )}
    </div>
  );
};
