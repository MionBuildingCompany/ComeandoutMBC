export interface Site {
  id: string;
  name: string;
  address: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
}

export interface WorkRecord {
  id: string;
  foremanName: string;
  siteId: string;
  workerId: string;
  date: string;
  startTime: string;
  lunchDuration: string;
  endTime: string;
  createdAt: number;
  status: 'active' | 'completed';
}

export type ViewState = 'login' | 'dashboard' | 'manage' | 'history' | 'reports' | 'worker_profile';
export type UserRole = 'admin' | 'user';

export interface UserSession {
  name: string;
  role: UserRole;
}

export interface TimeConfig {
  startTime: string;
  lunchDuration: string;
  endTime: string;
}