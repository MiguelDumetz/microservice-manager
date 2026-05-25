import { useQueries, useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import type { LiveService } from '../types'
import { fetchServices } from '../api/services'

async function pollService(url: string): Promise<Pick<LiveService, 'status' | 'errorCode' | 'latency'>> {
  const t0 = performance.now()
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
    const latency = Math.round(performance.now() - t0)
    if (res.ok) return { status: 'running', latency }
    return { status: 'error', errorCode: res.status, latency }
  } catch {
    return { status: 'dead' }
  }
}

interface UseLiveServicesResult {
  liveServices: LiveService[]
  isLoading: boolean
}

function useLiveServices(projectId: number): UseLiveServicesResult {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', projectId],
    queryFn: () => fetchServices(projectId),
  })

  const historyMapRef = useRef<Map<string, number[]>>(new Map())

  const results = useQueries({
    queries: services.map((service) => ({
      queryKey: ['status', service.url],
      queryFn: () => pollService(service.url),
      refetchInterval: () =>
        (historyMapRef.current.get(service.url)?.length ?? 0) < 2 ? 1000 : 5000,
      retry: false,
    })),
  })

  const liveServices: LiveService[] = services.map((service, i) => {
    const result = results[i]?.data
    const latency = result?.latency
    if (latency !== undefined) {
      const prev = historyMapRef.current.get(service.url) ?? []
      historyMapRef.current.set(service.url, [...prev.slice(-29), latency])
    }
    return {
      ...service,
      status: result?.status ?? 'dead',
      errorCode: result?.errorCode,
      latency,
      history: historyMapRef.current.get(service.url) ?? [],
    }
  })

  return { liveServices, isLoading }
}

export default useLiveServices
