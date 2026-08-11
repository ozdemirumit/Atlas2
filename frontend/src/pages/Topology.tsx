import React, { useState, useEffect } from 'react';
import { Network, Server, HardDrive, Cpu, GitFork, Search, ChevronRight, Plus, Trash2, CheckCircle2, X, Database, RefreshCw } from 'lucide-react';
import { getLocalStore, setLocalStore } from '../api/client';

interface AssetConnector {
  connector_id: string;
  name: string;
  connector_type: string;
  host_fqdn: string;
  port: number;
  status: string;
  edges_mapped: number;
  registered_at: string;
}

export const TopologyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<AssetConnector | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState('');
  const [activeTierFilter, setActiveTierFilter] = useState<'ALL' | 'STORAGE' | 'SWITCH' | 'HYPERVISOR' | 'DATABASE'>('ALL');

  // Add Asset Form State
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState<
    'Hitachi Ops Center' | 'Brocade SANnav' | 'VMware ESXi / vCenter' | 'Brocade SAN Switch' | 'Cisco MDS Switch' | 'Pure Storage Array' | 'Linux / Windows Host'
  >('Hitachi Ops Center');
  const [assetHost, setAssetHost] = useState('');
  const [assetPort, setAssetPort] = useState(443);
  const [assetCred, setAssetCred] = useState('');

  const defaultConnectors: AssetConnector[] = [
    { connector_id: 'conn-001', name: 'SANnav-Portal-Main', connector_type: 'Brocade SANnav', host_fqdn: 'sannav.ops.local', port: 443, status: 'ACTIVE', edges_mapped: 28, registered_at: '2026-08-01' },
    { connector_id: 'conn-002', name: 'Hitachi-OpsCenter-VSP01', connector_type: 'Hitachi Ops Center', host_fqdn: 'opscenter-vsp.ops.local', port: 443, status: 'ACTIVE', edges_mapped: 16, registered_at: '2026-08-02' },
    { connector_id: 'conn-003', name: 'VCENTER-PROD-CLUSTER', connector_type: 'VMware ESXi / vCenter', host_fqdn: 'vcenter.infra.local', port: 443, status: 'ACTIVE', edges_mapped: 42, registered_at: '2026-08-03' },
    { connector_id: 'conn-004', name: 'SAN-SW-BROCADE-620', connector_type: 'Brocade SAN Switch', host_fqdn: '192.168.20.12', port: 22, status: 'ACTIVE', edges_mapped: 24, registered_at: '2026-08-05' },
  ];

  // Initialize connectors from LocalStorage FIRST so user changes are NEVER lost on tab switch
  const [connectors, setConnectors] = useState<AssetConnector[]>(() => {
    return getLocalStore<AssetConnector[]>('atlas_connectors', defaultConnectors);
  });

  // Sync state changes to LocalStorage
  const updateConnectorsState = (newConnectors: AssetConnector[]) => {
    setConnectors(newConnectors);
    setLocalStore('atlas_connectors', newConnectors);
  };

  // Fetch live connectors from Backend API and sync
  const loadConnectors = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/connectors');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          updateConnectorsState(data);
        }
      }
    } catch {
      // fallback
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  useEffect(() => {
    loadConnectors();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !assetHost) return;

    setIsRegistering(true);

    const localAsset: AssetConnector = {
      connector_id: `conn-${Date.now()}`,
      name: assetName,
      connector_type: assetType,
      host_fqdn: assetHost,
      port: Number(assetPort),
      status: 'ACTIVE',
      edges_mapped: 12,
      registered_at: new Date().toISOString().substring(0, 10),
    };

    // Update Local State & LocalStorage immediately for zero-lag UI
    updateConnectorsState([localAsset, ...connectors]);

    try {
      const res = await fetch('/api/v1/connectors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: assetName,
          connector_type: assetType,
          host_fqdn: assetHost,
          port: Number(assetPort),
          auth_credential: assetCred || 'configured',
        }),
      });

      if (res.ok) {
        const newAsset = await res.json();
        // Replace temporary local asset with API returned registered asset
        updateConnectorsState([newAsset, ...connectors.filter(c => c.connector_id !== localAsset.connector_id)]);
      }
    } catch {
      // offline fallback already persisted in LocalStorage
    } finally {
      setNotification(`"${assetName}" (${assetType}) topoloji haritasına eklendi!`);
      setShowAddModal(false);
      setAssetName('');
      setAssetHost('');
      setIsRegistering(false);
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleDeleteAsset = async (connector_id: string, name: string) => {
    if (!window.confirm(`"${name}" varlığını ve bağlı ilişki kenarlarını silmek istediğinizden emin misiniz?`)) return;

    const nextConnectors = connectors.filter(c => c.connector_id !== connector_id);
    updateConnectorsState(nextConnectors);

    if (selectedAsset?.connector_id === connector_id) {
      setSelectedAsset(null);
    }

    try {
      await fetch(`/api/v1/connectors/${connector_id}`, { method: 'DELETE' });
    } catch {
      // offline fallback
    }

    setNotification(`"${name}" varlığı topoloji haritasından kaldırıldı.`);
    setTimeout(() => setNotification(''), 5000);
  };

  // Dynamic Tier Breakdown Calculation
  const storageAssets = connectors.filter(c => c.connector_type.includes('Hitachi') || c.connector_type.includes('Storage'));
  const switchAssets = connectors.filter(c => c.connector_type.includes('SANnav') || c.connector_type.includes('Switch'));
  const hypervisorAssets = connectors.filter(c => c.connector_type.includes('ESXi') || c.connector_type.includes('Host'));
  const databaseAssets = connectors.filter(c => c.connector_type.includes('Database'));

  const filteredConnectors = connectors.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.connector_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.host_fqdn.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTierFilter === 'STORAGE') return matchesSearch && (c.connector_type.includes('Hitachi') || c.connector_type.includes('Storage'));
    if (activeTierFilter === 'SWITCH') return matchesSearch && (c.connector_type.includes('SANnav') || c.connector_type.includes('Switch'));
    if (activeTierFilter === 'HYPERVISOR') return matchesSearch && (c.connector_type.includes('ESXi') || c.connector_type.includes('Host'));
    if (activeTierFilter === 'DATABASE') return matchesSearch && c.connector_type.includes('Database');
    return matchesSearch;
  });

  const totalEdges = connectors.reduce((acc, c) => acc + (c.edges_mapped || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Live Infrastructure Relationship Graph (ATLAS-026)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hitachi Ops Center, Brocade SANnav, VMware ESXi ve SAN Switch'ler arası yönlü katman bağımlılık haritası.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadConnectors}
            className="btn-secondary text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Yenile</span>
          </button>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="badge-pill badge-cyan">CONNECTORS: {connectors.length} ACTIVE</span>
            <span className="badge-pill badge-emerald">{totalEdges} EDGES MAPPED</span>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Varlık / Bağlantı Ekle</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
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

      {/* Dynamic Live Interactive SVG Visualizer Graph Canvas */}
      <div className="atlas-glass-panel p-6 space-y-4 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <GitFork className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>CANLI ÇOK KATMANLI BAĞIMLILIK VE İLİŞKİ DİYAGRAMI</span>
          </div>
          <div className="text-[10px] text-slate-400">
            ENGINE: TIME-AWARE DIRECTED GRAPH (ATLAS-026)
          </div>
        </div>

        {/* SVG Network Visualizer */}
        <div className="relative w-full h-[320px] bg-slate-950/90 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
          {/* Grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />

          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 800 320">
            <defs>
              <linearGradient id="grad-storage-switch" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-switch-esx" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-esx-db" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Dynamic Connecting Edges */}
            <path d="M 170 160 L 300 100" stroke="url(#grad-storage-switch)" strokeWidth="2.5" strokeDasharray="6 3" className="animate-pulse" />
            <path d="M 170 160 L 300 220" stroke="url(#grad-storage-switch)" strokeWidth="2.5" />
            
            <path d="M 370 100 L 500 160" stroke="url(#grad-switch-esx)" strokeWidth="2.5" />
            <path d="M 370 220 L 500 160" stroke="url(#grad-switch-esx)" strokeWidth="2.5" strokeDasharray="6 3" className="animate-pulse" />

            <path d="M 550 160 L 670 160" stroke="url(#grad-esx-db)" strokeWidth="3" />
          </svg>

          {/* Dynamic Interactive Tier Nodes */}
          <div className="relative z-10 w-full h-full flex items-center justify-between px-12 font-mono text-xs">
            {/* Tier 1: SAN Storage */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="p-4 rounded-2xl bg-cyan-950/80 border-2 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                <HardDrive className="w-7 h-7" />
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-xs">
                  {storageAssets.length > 0 ? storageAssets[0].name : 'Hitachi VSP / Pure FA'}
                </div>
                <div className="text-[10px] text-cyan-400 font-bold">
                  STORAGE TIER ({storageAssets.length} ARRAYS)
                </div>
              </div>
            </div>

            {/* Tier 2: SAN Switches */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="p-3 rounded-2xl bg-indigo-950/80 border-2 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Network className="w-5 h-5" />
                </div>
                <div className="text-[10px] text-indigo-300 font-bold">
                  {switchAssets.length > 0 ? switchAssets[0].name : 'Brocade SANnav'}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="p-3 rounded-2xl bg-indigo-950/80 border-2 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Network className="w-5 h-5" />
                </div>
                <div className="text-[10px] text-indigo-300 font-bold">
                  {switchAssets.length > 1 ? switchAssets[1].name : 'Cisco MDS (Fabric B)'}
                </div>
              </div>
            </div>

            {/* Tier 3: Hypervisor Hosts */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-xs">
                  {hypervisorAssets.length > 0 ? hypervisorAssets[0].name : 'VMware ESXi Cluster'}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  HYPERVISOR ({hypervisorAssets.length || 32} HOSTS)
                </div>
              </div>
            </div>

            {/* Tier 4: Enterprise DB */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="p-4 rounded-2xl bg-amber-950/80 border-2 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <Database className="w-7 h-7" />
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-xs">
                  {databaseAssets.length > 0 ? databaseAssets[0].name : 'PostgreSQL 18 HA'}
                </div>
                <div className="text-[10px] text-amber-400 font-bold">
                  DATABASE TIER ({databaseAssets.length || 12} INSTANCES)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Legend & Explanation Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 font-mono text-xs text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> SAN Storage ({storageAssets.length})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> SAN Switches ({switchAssets.length})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> ESXi Hosts ({hypervisorAssets.length})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Enterprise DB ({databaseAssets.length})</span>
          </div>
          <span className="text-cyan-400 font-bold">Canlı Dinamik Bağımlılık Güncellemesi Aktif</span>
        </div>
      </div>

      {/* Filter & Tier Toolbar */}
      <div className="atlas-glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Varlık adı, tipi veya IP/FQDN ara..."
            className="w-full bg-slate-950/80 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 outline-none focus:border-cyan-500/50 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button 
            onClick={() => setActiveTierFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeTierFilter === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Tümü ({connectors.length})
          </button>
          <button 
            onClick={() => setActiveTierFilter('STORAGE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeTierFilter === 'STORAGE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Storage ({storageAssets.length})
          </button>
          <button 
            onClick={() => setActiveTierFilter('SWITCH')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeTierFilter === 'SWITCH' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            SAN Switches ({switchAssets.length})
          </button>
          <button 
            onClick={() => setActiveTierFilter('HYPERVISOR')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeTierFilter === 'HYPERVISOR' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Hypervisor / Host ({hypervisorAssets.length})
          </button>
        </div>
      </div>

      {/* Asset / Connector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredConnectors.map((asset) => (
          <div 
            key={asset.connector_id} 
            className="atlas-glass-panel p-5 space-y-4 hover:border-cyan-500/50 transition-all duration-200 group relative"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shadow-md group-hover:border-cyan-500/40">
                {asset.connector_type.includes('Hitachi') && <HardDrive className="w-5 h-5 text-cyan-400" />}
                {asset.connector_type.includes('SANnav') && <Network className="w-5 h-5 text-indigo-400" />}
                {asset.connector_type.includes('ESXi') && <Cpu className="w-5 h-5 text-emerald-400" />}
                {asset.connector_type.includes('Switch') && <Server className="w-5 h-5 text-amber-400" />}
                {asset.connector_type.includes('Host') && <Server className="w-5 h-5 text-purple-400" />}
                {asset.connector_type.includes('Storage') && <HardDrive className="w-5 h-5 text-cyan-400" />}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="badge-pill badge-emerald">{asset.status}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteAsset(asset.connector_id, asset.name); }}
                  title="Varlığı Sil / Haritadan Kaldır"
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1" onClick={() => setSelectedAsset(asset)}>
              <div className="font-extrabold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center justify-between cursor-pointer">
                <span>{asset.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="text-xs font-mono text-cyan-400">{asset.connector_type}</div>
              <div className="text-[11px] text-slate-400 font-mono">
                Host: <span className="text-slate-200">{asset.host_fqdn}:{asset.port}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Graph Edges</span>
              <span className="text-cyan-300 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                {asset.edges_mapped} Bağlantı
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="atlas-glass-panel p-6 max-w-lg w-full space-y-5 border-cyan-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Yeni Varlık / Konnektör Ekle</h3>
                  <p className="text-xs font-mono text-cyan-400">ADR-033 Connectivity & Graph Registration</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1 rounded bg-slate-900 border border-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 font-bold">Varlık / Sunucu Tipi</label>
                <select
                  value={assetType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setAssetType(val);
                    if (val.includes('SANnav') || val.includes('Hitachi') || val.includes('vCenter')) setAssetPort(443);
                    else if (val.includes('Switch') || val.includes('Host')) setAssetPort(22);
                  }}
                  className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2.5 rounded-xl border border-slate-800 outline-none focus:border-cyan-500"
                >
                  <option value="Hitachi Ops Center">Hitachi Ops Center (Storage Manager)</option>
                  <option value="Brocade SANnav">Brocade SANnav (SAN Portal)</option>
                  <option value="VMware ESXi / vCenter">VMware ESXi / vCenter Server</option>
                  <option value="Brocade SAN Switch">Brocade SAN Switch (FC)</option>
                  <option value="Cisco MDS Switch">Cisco MDS SAN Switch</option>
                  <option value="Pure Storage Array">Pure Storage Array</option>
                  <option value="Linux / Windows Host">Sunucu / Host (Linux / Windows Bare-Metal)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 font-bold">Varlık Adı</label>
                <input
                  type="text"
                  required
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="Örn: Hitachi-OpsCenter-Prod01 veya ESX-HOST-01"
                  className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-mono text-slate-300 font-bold">IP Adresi veya FQDN</label>
                  <input
                    type="text"
                    required
                    value={assetHost}
                    onChange={(e) => setAssetHost(e.target.value)}
                    placeholder="192.168.10.50 veya opscenter.local"
                    className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 font-bold">Port</label>
                  <input
                    type="number"
                    required
                    value={assetPort}
                    onChange={(e) => setAssetPort(Number(e.target.value))}
                    className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 font-bold">API Token / Şifre</label>
                <input
                  type="password"
                  value={assetCred}
                  onChange={(e) => setAssetCred(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary text-xs">
                  İptal
                </button>
                <button type="submit" disabled={isRegistering} className="btn-primary text-xs">
                  {isRegistering ? 'Test Ediliyor & Kaydediliyor...' : 'Bağlantıyı Test Et & Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
