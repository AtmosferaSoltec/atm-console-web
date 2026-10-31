import type { TenantItem } from '@/features/tenants'

/** The code the auth API gives La Vendimia. It is declared there, in the catalog of systems. */
export const LAVENDIMIA_SYSTEM_CODE = 'lavendimia'

export interface LavendimiaCompaniesTableProps {
  companies: TenantItem[]
  emptyMessage: string
  /** Billing permission by RUC. A company missing from it is still loading. */
  billing: BillingByRuc
  onBillingChanged: () => void
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

/** Whether a company of La Vendimia can issue electronic documents, as atm-nubefact-api knows it. */
export type BillingAccess =
  /** The company has no issuer in the billing service: it cannot issue until one is registered. */
  | { kind: 'no-issuer' }
  | { kind: 'issuer'; issuerId: string; allowed: boolean }

export interface BillingByRuc {
  [ruc: string]: BillingAccess
}

export interface LavendimiaBillingSwitchProps {
  access: BillingAccess | undefined
  /** Called after the permission changed, so the list can reload. */
  onChanged: () => void
}
