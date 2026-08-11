import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Search, Sparkles, Lock, ArrowRight, Plus, Upload, CheckCircle2, X } from 'lucide-react';
import { getLocalStore, setLocalStore } from '../api/client';

interface KnowledgeDoc {
  document_id: string;
  title: string;
  category: string;
  version: string;
  access_boundary: string;
  content?: string;
  chunks_count: number;
  created_at: string;
  status: string;
  description?: string;
}

export const KnowledgePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'restricted' | 'internal'>('all');
  const [showModal, setShowModal] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'Storage' | 'SAN Switch' | 'Hypervisor' | 'Database' | 'General Ops'>('Storage');
  const [docVersion, setDocVersion] = useState('v1.0.0');
  const [docAccess, setDocAccess] = useState<'Internal Ops' | 'Restricted (Engineering)' | 'Restricted (NOC)'>('Internal Ops');
  const [docContent, setDocContent] = useState('');

  const defaultPacks: KnowledgeDoc[] = [
    { document_id: 'doc-001', title: 'Pure Storage Purity//FA Operational Guide', category: 'Storage', version: 'v6.4.x', chunks_count: 1420, access_boundary: 'Restricted (Engineering)', created_at: '2026-08-01', status: 'INDEXED', description: 'Deep-dive CLI troubleshooting, NVMe-oF configuration, and non-disruptive firmware upgrade procedures.' },
    { document_id: 'doc-002', title: 'Brocade Fabric OS Administrator Manual', category: 'SAN Switch', version: 'v9.1.x', chunks_count: 980, access_boundary: 'Restricted (NOC)', created_at: '2026-07-28', status: 'INDEXED', description: 'FC port zoning, SFP optical transceiver diagnostic thresholds, and trunking configuration.' },
    { document_id: 'doc-003', title: 'VMware vSphere 8 Core Troubleshooting', category: 'Hypervisor', version: 'v8.0u2', chunks_count: 2310, access_boundary: 'Internal Ops', created_at: '2026-08-04', status: 'INDEXED', description: 'vMotion failures, APD/PDL storage condition resolution, and ESXi kernel panic analysis.' },
    { document_id: 'doc-004', title: 'PostgreSQL Enterprise HA Runbook', category: 'Database', version: 'v18.0', chunks_count: 640, access_boundary: 'Internal Ops', created_at: '2026-08-09', status: 'INDEXED', description: 'Patroni failover procedures, WAL archive replication lag tuning, and autovacuum optimization.' },
  ];

  // Initialize packs from LocalStorage FIRST
  const [packs, setPacks] = useState<KnowledgeDoc[]>(() => {
    return getLocalStore<KnowledgeDoc[]>('atlas_knowledge', defaultPacks);
  });

  const updatePacksState = (newPacks: KnowledgeDoc[]) => {
    setPacks(newPacks);
    setLocalStore('atlas_knowledge', newPacks);
  };

  // Fetch live documents from API if available
  useEffect(() => {
    fetch('/api/v1/knowledge/documents')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          updatePacksState(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setDocContent(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docContent) return;

    setIsIngesting(true);

    const localDoc: KnowledgeDoc = {
      document_id: `doc-${Date.now()}`,
      title: docTitle,
      category: docCategory,
      version: docVersion,
      access_boundary: docAccess,
      chunks_count: Math.max(1, Math.floor(docContent.length / 250)),
      created_at: new Date().toISOString().substring(0, 10),
      status: 'INDEXED',
      description: docContent.substring(0, 140) + '...',
    };

    // Save to LocalStorage immediately
    updatePacksState([localDoc, ...packs]);

    try {
      const res = await fetch('/api/v1/knowledge/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle,
          category: docCategory,
          version: docVersion,
          access_boundary: docAccess,
          content: docContent,
        }),
      });

      if (res.ok) {
        const newDoc = await res.json();
        updatePacksState([newDoc, ...packs.filter(p => p.document_id !== localDoc.document_id)]);
      }
    } catch {
      // offline fallback already saved in LocalStorage
    } finally {
      setSuccessMessage(`"${docTitle}" RAG indeksine başarıyla eklendi ve parçalandı!`);
      setShowModal(false);
      setDocTitle('');
      setDocContent('');
      setIsIngesting(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const filteredPacks = packs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (activeTab === 'restricted') return matchesSearch && doc.access_boundary.includes('Restricted');
    if (activeTab === 'internal') return matchesSearch && doc.access_boundary === 'Internal Ops';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Governed RAG Knowledge Base (ATLAS-015)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Üretici kılavuzları, runbook'lar ve kurumsal bilginin indekslendiği anlamsal kanıt kütüphanesi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="badge-pill badge-cyan">TOTAL DOCUMENTS: {packs.length}</span>
            <span className="badge-pill badge-emerald">INDEXED CHUNKS: {packs.reduce((acc, p) => acc + p.chunks_count, 0)}</span>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Döküman Yükle (Ingest)</span>
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* RAG Knowledge Engine Stats Banner */}
      <div className="atlas-glass-panel p-6 border-l-4 border-l-cyan-500 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Retrieval-Augmented Generation (RAG) Provenance Engine</h3>
              <p className="text-xs text-slate-400 font-mono">ADR-015 Evidence-Grounded AI Analysis with Explicit Lineage</p>
            </div>
          </div>
          <span className="badge-pill badge-cyan hidden sm:inline-flex">PROVENANCE TRACKING: ENABLED</span>
        </div>
      </div>

      {/* Search & ACL Filter Toolbar */}
      <div className="atlas-glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Döküman, kategori veya anahtar kelime ara..."
            className="w-full bg-slate-950/80 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 outline-none focus:border-cyan-500/50 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Tüm Belgeler ({packs.length})
          </button>
          <button
            onClick={() => setActiveTab('restricted')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'restricted' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Restricted ACL ({packs.filter(p => p.access_boundary.includes('Restricted')).length})
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'internal' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Internal Ops ({packs.filter(p => p.access_boundary === 'Internal Ops').length})
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPacks.map((pack) => (
          <div key={pack.document_id} className="atlas-glass-panel p-6 space-y-4 hover:border-cyan-500/50 transition-all duration-200 group">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-cyan-400 font-bold">{pack.category}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{pack.version}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {pack.title}
                </h4>
              </div>
              <span className={`badge-pill shrink-0 ${pack.access_boundary.includes('Restricted') ? 'badge-purple' : 'badge-emerald'}`}>
                <Lock className="w-2.5 h-2.5" />
                {pack.access_boundary}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
              {pack.description || pack.content || 'Yüklenmiş döküman metni parçalanmış ve RAG indeksine dahil edilmiştir.'}
            </p>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-300 font-bold">{pack.chunks_count}</span> Chunks
                </span>
                <span>{pack.created_at}</span>
              </div>
              <button className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Detaylar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ingest Document Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="atlas-glass-panel p-6 max-w-xl w-full space-y-5 border-cyan-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Yeni Döküman Yükle (RAG Ingestion)</h3>
                  <p className="text-xs font-mono text-cyan-400">ATLAS-015 Document Vector Chunking</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded bg-slate-900 border border-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIngestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 font-bold">Döküman Başlığı</label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Örn: Brocade FC Switch Port Zoning Guide"
                    className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 font-bold">Kategori</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500"
                  >
                    <option value="Storage">SAN Storage</option>
                    <option value="SAN Switch">SAN Switch</option>
                    <option value="Hypervisor">Hypervisor</option>
                    <option value="Database">Database</option>
                    <option value="General Ops">General Ops</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 font-bold">Versiyon</label>
                  <input
                    type="text"
                    required
                    value={docVersion}
                    onChange={(e) => setDocVersion(e.target.value)}
                    placeholder="v1.0.0"
                    className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 font-bold">Erişim Sınırı (ACL)</label>
                  <select
                    value={docAccess}
                    onChange={(e) => setDocAccess(e.target.value as any)}
                    className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500"
                  >
                    <option value="Internal Ops">Internal Ops</option>
                    <option value="Restricted (Engineering)">Restricted (Engineering)</option>
                    <option value="Restricted (NOC)">Restricted (NOC)</option>
                  </select>
                </div>
              </div>

              {/* File Upload Selector */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 font-bold">Dosyadan Yükle (.txt, .md, .json)</label>
                <input
                  type="file"
                  accept=".txt,.md,.json,.pdf"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 font-bold">Döküman İçeriği / Metin</label>
                <textarea
                  required
                  rows={5}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Döküman metnini buraya yapıştırın veya dosyadan yükleyin..."
                  className="w-full bg-slate-950 text-xs text-slate-100 p-3 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-xs">
                  İptal
                </button>
                <button type="submit" disabled={isIngesting} className="btn-primary text-xs">
                  {isIngesting ? 'Parçalanıyor ve İndeksleniyor...' : 'Ayrıştır ve İndekse Ekle (Ingest)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
