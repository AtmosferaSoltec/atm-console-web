import type { TenantItem } from '@/features/tenants'

/** The code the auth API gives La Vendimia. It is declared there, in the catalog of systems. */
export const LAVENDIMIA_SYSTEM_CODE = 'lavendimia'

export interface LavendimiaCompaniesTableProps {
  companies: TenantItem[]
  emptyMessage: string
}

export interface NewLavendimiaCompanyDialogProps {
  open: boolean
  /** The id of La Vendimia in the auth API. The dialog stays closed-in-effect until it is known. */
  systemId: string | null
  onClose: () => void
  onCreated: () => void
}

export interface NewLavendimiaCompanyInput {
  systemId: string
  ruc: string
  legalName: string
  tradeName: string
  /** Empty means a new client named after the company. */
  clientId: string
}
