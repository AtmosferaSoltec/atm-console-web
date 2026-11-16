import { isValidDocument } from '@/features/users'
import type { AdminChoice, ClientDraft, DraftBranch, DraftCompany } from '../types/pulsoSetup.types'

function key(): string {
  return crypto.randomUUID()
}

export function emptyBranch(name = ''): DraftBranch {
  return { key: key(), name }
}

export function emptyCompany(tradeName = ''): DraftCompany {
  return { key: key(), tradeName, ruc: '', branches: [emptyBranch('Sede principal')], modules: [], admin: null }
}

export function emptyClient(): ClientDraft {
  return { clientId: null, companies: [emptyCompany()] }
}

/** Problems that stop a company from being created, in Spanish, or an empty list. */
export function companyProblems(draft: DraftCompany): string[] {
  const problems: string[] = []
  if (!draft.tradeName.trim()) problems.push('Falta el nombre comercial.')
  if (draft.ruc.trim() && !/^\d{11}$/.test(draft.ruc.trim())) problems.push('El RUC debe tener 11 dígitos.')
  if (!draft.branches.some((branch) => branch.name.trim())) problems.push('Agrega al menos una sede.')
  return problems
}

/** Problems with a chosen administrator, in Spanish; a new account needs a valid document and a name. */
export function adminProblems(admin: AdminChoice | null): string[] {
  if (!admin || admin.userId) return []
  const problems: string[] = []
  if (!isValidDocument(admin.documentType, admin.documentNumber)) problems.push('El documento del administrador no es válido.')
  if (!admin.fullName.trim()) problems.push('Falta el nombre del administrador.')
  return problems
}
