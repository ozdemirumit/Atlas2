import { SystemHealth, SubjectIdentity } from '../types';

export async function fetchHealthStatus(): Promise<SystemHealth> {
  try {
    const res = await fetch('/health');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch {
    return {
      status: 'error',
      project: 'Project Atlas',
      version: '1.0.0',
      environment: 'offline',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchCurrentIdentity(): Promise<SubjectIdentity> {
  try {
    const res = await fetch('/api/v1/identity/me');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch {
    return {
      subject_id: 'local-operator',
      display_name: 'Local Operator (Offline Fallback)',
      environment: 'development',
      roles: ['C0_OPERATOR'],
      scopes: ['identity.self.read'],
      max_capability_class: 'C0',
      is_development_identity: true,
    };
  }
}
