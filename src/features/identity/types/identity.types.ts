export interface ProviderUsage {
  usedThisMonth: number
  monthlyCap: number
  providerPlanLimit: number
  cachedPersons: number
  cachedCompanies: number
  cacheHitRate: number
}

export interface IdentityClientSystem {
  id: string
  code: string
  name: string
  isActive: boolean
  lastUsedAt: string | null
  queriesThisMonth: number
}

export interface CachedPerson {
  documentNumber: string
  firstNames: string
  paternalSurname: string
  maternalSurname: string
  storedAt: string
}

export interface CachedCompany {
  documentNumber: string
  legalName: string
  tradeName: string | null
  address: string | null
  storedAt: string
}

export type LookupKind = 'persons' | 'companies'

export interface IdentityUsageCardsProps {
  usage: ProviderUsage
}

export interface ClientSystemsTableProps {
  systems: IdentityClientSystem[]
  onRevoke: (system: IdentityClientSystem) => void
}

export interface PersonsTableProps {
  persons: CachedPerson[]
}

export interface CompaniesTableProps {
  companies: CachedCompany[]
}

export interface IdentityDialogProps {
  open: boolean
  onClose: () => void
}

export interface QueriesBySystemProps {
  systems: IdentityClientSystem[]
  monthlyCap: number
}
