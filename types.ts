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
}

export type ViewState = 'login' | 'dashboard' | 'manage' | 'history' | 'reports';

export interface TimeConfig {
  startTime: string;
  lunchDuration: string;
  endTime: string;
}