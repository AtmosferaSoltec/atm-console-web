import { getCachedCompanies, getCachedPersons, getIdentityClientSystems, getProviderUsage } from '../services/identityService'
import type { CachedCompany, CachedPerson, IdentityClientSystem, ProviderUsage } from '../types/identity.types'

export function useProviderUsage(): ProviderUsage {
  return getProviderUsage()
}

export function useIdentityClientSystems(): IdentityClientSystem[] {
  return getIdentityClientSystems()
}

export function useCachedPersons(): CachedPerson[] {
  return getCachedPersons()
}

export function useCachedCompanies(): CachedCompany[] {
  return getCachedCompanies()
}
