import { useMemo } from 'react'
import useLiveServices from './useLiveServices'

interface ProjectStatusCounts {
  running: number
  error: number
  dead: number
  total: number
}

function useProjectStatus(projectId: number): ProjectStatusCounts {
  const { liveServices } = useLiveServices(projectId)

  return useMemo(() => ({
    running: liveServices.filter((s) => s.status === 'running').length,
    error:   liveServices.filter((s) => s.status === 'error').length,
    dead:    liveServices.filter((s) => s.status === 'dead').length,
    total:   liveServices.length,
  }), [liveServices])
}

export default useProjectStatus
