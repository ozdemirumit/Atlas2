import React, { useState } from 'react';
import { Network, Server, HardDrive, Cpu, GitFork, Search, Info, ChevronRight } from 'lucide-react';
import { InfrastructureNode } from '../types';

export const TopologyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<InfrastructureNode | null>(null);

  const nodes: InfrastructureNode[] = [
    { id: 'san-01', name: 'SAN-ARRAY-P01', type: 'Storage', vendor: 'Pure Storage FlashArray //X90', status: 'Healthy', connector: 'mcp-purestorage-v1', relationshipsCount: 14 },
    { id: 'sw-01', name: 'SAN-SW-BROCADE-01', type: 'SAN Switch', vendor: 'Brocade G620 64G FC', status: 'Healthy', connector: 'mcp-brocade-v1', relationshipsCount: 28 },
    { id: 'sw-02', name: 'SAN-SW-CISCO-02', type: 'SAN Switch', vendor: 'Cisco MDS 9718 Director', status: 'Healthy', connector: 'mcp-cisco-v1', relationshipsCount: 32 },
    { id: 'esx-01', name: 'ESXI-CLUSTER-PROD01', type: 'Hypervisor', vendor: 'VMware ESXi 8.0u2 HA', status: 'Healthy', connector: 'mcp-vsphere-v1', relationshipsCount: 42 },
    { id: 'esx-02', name: 'PROXMOX-CLUSTER-DMZ', type: 'Hypervisor', vendor: 'Proxmox VE 8.1 Cluster', status: 'Healthy', connector: 'mcp-proxmox-v1', relationshipsCount: 18 },
    { id: 'db-01', name: 'PG-CLUSTER-FINANCE', type: 'Database', vendor: 'PostgreSQL 18 HA Cluster', status: 'Healthy', connector: 'mcp-postgres-v1', relationshipsCount: 8 },
  ];

  const filteredNodes = nodes.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Infrastructure Topology & Knowledge Graph
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Time-aware graph mapping relationships between SAN arrays, FC switches, hypervisors, and database clusters (ATLAS-026).
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="badge-pill badge-cyan">GRAPH ENGINE: ONLINE</span>
          <span className="badge-pill badge-emerald">64 EDGES MAPPED</span>
        </div>
      </div>

      {/* Interactive Topology Graph Visualizer Panel */}
      <div className="atlas-glass-panel p-8 relative overflow-hidden text-center space-y-5 border-dashed border-cyan-500/30">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-slate-500">
          LAYOUT: GRAPHVIZ HYBRID DIRECTED
        </div>
        <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          <GitFork className="w-8 h-8 animate-pulse" />
        </div>
        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="text-lg font-bold text-slate-100">Live Relationship Graph View</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            MCP connectors continuously stream telemetry and dependency events. Select an infrastructure asset below to inspect detailed graph edge lineages.
          </p>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Storage Tier</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> FC Switch Tier</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Hypervisor Tier</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Database Tier</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="atlas-glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by name, type, or vendor..."
            className="w-full bg-slate-950/80 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 outline-none focus:border-cyan-500/50 font-sans"
          />
        </div>
        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-cyan-300 font-bold">{filteredNodes.length}</span> of {nodes.length} registered graph nodes
        </div>
      </div>

      {/* Registered Graph Assets Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNodes.map((node) => (
          <div 
            key={node.id} 
            onClick={() => setSelectedNode(node)}
            className="atlas-glass-panel p-5 space-y-4 cursor-pointer hover:border-cyan-500/50 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shadow-md group-hover:border-cyan-500/40">
                {node.type === 'Storage' && <HardDrive className="w-5 h-5" />}
                {node.type === 'SAN Switch' && <Network className="w-5 h-5 text-indigo-400" />}
                {node.type === 'Hypervisor' && <Cpu className="w-5 h-5 text-emerald-400" />}
                {node.type === 'Database' && <Server className="w-5 h-5 text-amber-400" />}
              </div>
              <span className="badge-pill badge-emerald">{node.status}</span>
            </div>

            <div className="space-y-1">
              <div className="font-extrabold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                <span>{node.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="text-xs text-slate-400 font-mono truncate">{node.vendor}</div>
              <div className="text-[11px] text-cyan-400/90 font-mono pt-1">
                Connector: <span className="text-slate-300">{node.connector}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Graph Relationships</span>
              <span className="text-cyan-300 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                {node.relationshipsCount} Edges
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Node Detail Modal / Inspector */}
      {selectedNode && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="atlas-glass-panel p-6 max-w-xl w-full space-y-5 border-cyan-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{selectedNode.name}</h3>
                  <p className="text-xs font-mono text-cyan-400">Node ID: {selectedNode.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white font-mono text-xs px-3 py-1 rounded bg-slate-900 border border-slate-800"
              >
                Close ESC
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Asset Type:</span>
                <span className="text-slate-200 font-bold">{selectedNode.type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Vendor Model:</span>
                <span className="text-slate-200">{selectedNode.vendor}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">MCP Connector:</span>
                <span className="text-cyan-400 font-bold">{selectedNode.connector}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Graph Relationships:</span>
                <span className="text-emerald-400 font-bold">{selectedNode.relationshipsCount} Active Edges</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Associated Lineage Nodes</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Mapped to SAN Fabric A/B ports, VMware datastores, and PostgreSQL transaction logs. All event state changes are logged with non-repudiation audit records.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedNode(null)}
                className="btn-primary text-xs"
              >
                Inspect Telemetry Traces
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
