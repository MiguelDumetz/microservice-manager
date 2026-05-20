export interface Project {
  id: number;
  name: string;
}

export interface Service {
  id: number;
  name: string;
  url: string;
}

export type ServiceStatus = 'running' | 'dead' | 'error';

export interface User {
  id: string;
  name: string;
  email: string;
}
