import { useAction } from '@/hooks/useAction'
import { enableSystem, setSystemActive } from '../services/messagingSystemService'

export function useEnableSystem() {
  return useAction(enableSystem, 'No se pudo habilitar el sistema. Intenta de nuevo.')
}

export function useSetSystemActive() {
  return useAction(
    (tenantId: string, isActive: boolean) => setSystemActive(tenantId, isActive),
    'No se pudo cambiar el estado del sistema. Intenta de nuevo.',
  )
}
