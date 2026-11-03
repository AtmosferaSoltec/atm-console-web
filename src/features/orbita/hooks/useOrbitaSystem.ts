import { useSystems } from '@/features/systems'
import { ORBITA_SYSTEM_CODE } from '../types/orbita.types'

/** Orbita as the auth API knows it. `system` is undefined while loading or if the catalog does not have it. */
export function useOrbitaSystem() {
  const { systems, isLoading, error, reload } = useSystems()
  return { system: systems.find((item) => item.code === ORBITA_SYSTEM_CODE), isLoading, error, reload }
}
