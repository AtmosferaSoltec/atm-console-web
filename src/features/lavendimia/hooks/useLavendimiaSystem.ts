import { useSystems } from '@/features/systems'
import { LAVENDIMIA_SYSTEM_CODE } from '../types/lavendimia.types'

/** La Vendimia as the auth API knows it. `system` is undefined while loading or if the catalog does not have it. */
export function useLavendimiaSystem() {
  const { systems, isLoading, error, reload } = useSystems()
  return { system: systems.find((item) => item.code === LAVENDIMIA_SYSTEM_CODE), isLoading, error, reload }
}
