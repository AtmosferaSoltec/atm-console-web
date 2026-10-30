import { useApiQuery } from '@/hooks/useApiQuery'
import { getRenderActivity } from '../services/activityService'
import type { RenderActivity } from '../types/activity.types'

interface RenderActivityResult {
  activity: RenderActivity | null
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useRenderActivity(): RenderActivityResult {
  const { data, isLoading, error, reload } = useApiQuery(getRenderActivity)
  return { activity: data, isLoading, error, reload }
}
