export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'error';
  project: string;
  version: string;
  environment: string;
  timestamp: string;
}

export interface SubjectIdentity {
  subject_id: str;
  display_name: str;
  environment: str;
  roles: string[];
  scopes: string[];
  max_capability_class: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
  is_development_identity: boolean;
}

type str = string;

export interface AuditEvent {
  id: string;
  timestamp: string;
  event_type: string;
  subject_id: string;
  action: string;
  status: 'ALLOWED' | 'DENIED' | 'AUDITED';
  resource?: string;
  details?: Record<string, unknown>;
}

export interface InfrastructureNode {
  id: string;
  name: string;
  type: 'Storage' | 'SAN Switch' | 'Hypervisor' | 'Database' | 'Network' | 'Backup';
  vendor: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  connector: string;
  relationshipsCount: number;
}
