import React from 'react';
import { Network, Server, HardDrive, Cpu, GitFork } from 'lucide-react';
import { InfrastructureNode } from '../types';

export const TopologyPage: React.FC = () => {
  const nodes: InfrastructureNode[] = [
    { id: 'san-01', name: 'SAN-ARRAY-P01', type: 'Storage', vendor: 'Pure Storage FlashArray', status: 'Healthy', connector: 'mcp-purestorage-v1', relationshipsCount: 14 },
    { id: 'sw-01', name: 'SAN-SW-BROCADE-01', type: 'SAN Switch', vendor: 'Brocade G620 FC', status: 'Healthy', connector: 'mcp-brocade-v1', relationshipsCount: 28 },
    { id: 'esx-01', name: 'ESXI-CLUSTER-PROD01', type: 'Hypervisor', vendor: 'VMware ESXi 8.0u2', status: 'Healthy', connector: 'mcp-vsphere-v1', relationshipsCount: 42 },
    { id: 'db-01', name: 'PG-CLUSTER-FINANCE', type: 'Database', vendor: 'PostgreSQL 18 HA', status: 'Healthy', connector: 'mcp-postgres-v1', relationshipsCount: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            Infrastructure Topology & Knowledge Graph
          </h2>
          <p className="text-xs text-slate-400">
            Time-aware graph mapping relationships between SAN switches, LUNs, ESXi hosts, VMs, and DB instances.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="badge badge-cyan">GRAPH ENGINE: ONLINE</span>
        </div>
      </div>

      {/* Topology Relationship Visualization Placeholder */}
      <div className="glass-panel p-8 text-center space-y-4 border-dashed border-slate-700/80">
        <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <GitFork className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-200">Interactive Knowledge Graph Visualizer</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mt-1">
            Visualizing dependency lineage across 4 infrastructure tiers. MCP connectors continuously report state and relationship events to Graph Engine (ATLAS-026).
          </p>
        </div>
      </div>

      {/* Registered Graph Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => (
          <div key={node.id} className="glass-panel p-4 flex items-center justify-between hover:border-cyan-500/40">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                {node.type === 'Storage' && <HardDrive className="w-5 h-5" />}
                {node.type === 'SAN Switch' && <Network className="w-5 h-5 text-indigo-400" />}
                {node.type === 'Hypervisor' && <Cpu className="w-5 h-5 text-emerald-400" />}
                {node.type === 'Database' && <Server className="w-5 h-5 text-amber-400" />}
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100">{node.name}</div>
                <div className="text-xs text-slate-400 font-mono">{node.vendor}</div>
                <div className="text-[11px] text-cyan-400/80 font-mono mt-0.5">Connector: {node.connector}</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="badge badge-emerald">{node.status}</span>
              <div className="text-[11px] text-slate-400 mt-2">{node.relationshipsCount} Graph Edges</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
