import { useApiQuery } from '@/hooks/useApiQuery'
import { listMessagingSystems } from '../services/messagingSystemService'
import type { MessagingSystem } from '../types/messagingSystem.types'

interface MessagingSystemsResult {
  systems: MessagingSystem[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useMessagingSystems(): MessagingSystemsResult {
  const { data, isLoading, error, reload } = useApiQuery(listMessagingSystems)
  return { systems: data ?? [], isLoading, error, reload }
}
