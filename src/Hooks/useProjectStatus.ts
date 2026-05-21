import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../api/services';
import { ServiceStatus } from '../types';

interface ProjectStatusCounts {
  running: number;
  error: number;
  dead: number;
  total: number;
}

function useProjectStatus(projectId: number): ProjectStatusCounts {
  const { data: services = [] } = useQuery({
    queryKey: ['services', projectId],
    queryFn: () => fetchServices(projectId),
  });

  const serviceKey = services.map((s) => s.id).join(',');

  const { data: counts } = useQuery({
    queryKey: ['project-status', projectId, serviceKey],
    queryFn: async (): Promise<ProjectStatusCounts> => {
      const statuses = await Promise.all(
        services.map(async (service): Promise<ServiceStatus> => {
          try {
            const res = await fetch(service.url, { signal: AbortSignal.timeout(3000) });
            return res.ok ? 'running' : 'error';
          } catch {
            return 'dead';
          }
        })
      );
      return {
        running: statuses.filter((s) => s === 'running').length,
        error:   statuses.filter((s) => s === 'error').length,
        dead:    statuses.filter((s) => s === 'dead').length,
        total:   statuses.length,
      };
    },
    enabled: services.length > 0,
    refetchInterval: 5000,
    retry: false,
  });

  if (services.length === 0) return { running: 0, error: 0, dead: 0, total: 0 };
  return counts ?? { running: 0, error: 0, dead: services.length, total: services.length };
}

export default useProjectStatus;
