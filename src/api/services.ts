import { Service } from '../types';

const API_BASE = 'http://localhost:3030'

export async function fetchServices(projectId: number): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/api/projects/${projectId}/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function createService(
  projectId: number,
  data: { name: string; url: string }
): Promise<Service> {
  const res = await fetch(`${API_BASE}/api/projects/${projectId}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create service');
  return res.json();
}

export async function updateService(
  projectId: number,
  serviceId: number,
  data: { name: string; url: string }
): Promise<Service> {
  const res = await fetch(`${API_BASE}/api/projects/${projectId}/services/${serviceId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update service');
  return res.json();
}

export async function deleteServices(
  projectId: number,
  serviceIds: number[]
): Promise<void> {
  await Promise.all(
    serviceIds.map((id) =>
      fetch(`${API_BASE}/api/projects/${projectId}/services/${id}`, { method: 'DELETE' })
    )
  );
}
