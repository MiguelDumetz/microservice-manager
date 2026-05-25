import { Project } from '../types';

const API_BASE = 'http://localhost:3030'

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/api/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProject(id: number): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/projects/${id}`);
  if (!res.ok) {
    throw new Error(`Project not found`);
  }
  return res.json();
}

export async function createProject(name: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function updateProject(id: number, name: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function deleteProjects(ids: number[]): Promise<void> {
  await Promise.all(
    ids.map((id) => fetch(`${API_BASE}/api/projects/${id}`, { method: 'DELETE' }))
  );
}
