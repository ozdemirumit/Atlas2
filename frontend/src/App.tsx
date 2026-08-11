import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { OverviewPage } from './pages/Overview';
import { TopologyPage } from './pages/Topology';
import { KnowledgePage } from './pages/Knowledge';
import { IncidentsPage } from './pages/Incidents';
import { HealthChecksPage } from './pages/HealthChecks';
import { AuditLogsPage } from './pages/AuditLogs';
import { fetchHealthStatus, fetchCurrentIdentity } from './api/client';
import { SubjectIdentity, SystemHealth } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [identity, setIdentity] = useState<SubjectIdentity | null>(null);

  useEffect(() => {
    const loadSystemData = async () => {
      const healthData = await fetchHealthStatus();
      const identityData = await fetchCurrentIdentity();
      setHealth(healthData);
      setIdentity(identityData);
    };

    loadSystemData();
    const interval = setInterval(loadSystemData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header identity={identity} health={health} />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
          {activeTab === 'overview' && <OverviewPage identity={identity} health={health} />}
          {activeTab === 'topology' && <TopologyPage />}
          {activeTab === 'knowledge' && <KnowledgePage />}
          {activeTab === 'incidents' && <IncidentsPage />}
          {activeTab === 'health' && <HealthChecksPage />}
          {activeTab === 'audit' && <AuditLogsPage />}
        </main>
      </div>
    </div>
  );
};

export default App;
