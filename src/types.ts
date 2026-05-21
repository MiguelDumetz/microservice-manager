export interface Project {
  id: number;
  name: string;
}

export interface Service {
  id: number;
  name: string;
  url: string;
  projectId: number;
}

export type ServiceStatus = 'running' | 'dead' | 'error';
