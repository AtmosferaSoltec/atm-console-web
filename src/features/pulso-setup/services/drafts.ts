import type { ClientDraft, DraftBranch, DraftCompany } from '../types/pulsoSetup.types'

function key(): string {
  return crypto.randomUUID()
}

export function emptyBranch(name = ''): DraftBranch {
  return { key: key(), name }
}

export function emptyCompany(tradeName = ''): DraftCompany {
  return { key: key(), tradeName, ruc: '', branches: [emptyBranch('Sede principal')], modules: [], adminDocument: '', adminName: '' }
}

export function emptyClient(): ClientDraft {
  return { existingClientId: null, name: '', companies: [emptyCompany()] }
}

/** Problems that stop a company from being created, in Spanish, or an empty list. */
export function companyProblems(draft: DraftCompany): string[] {
  const problems: string[] = []
  if (!draft.tradeName.trim()) problems.push('Falta el nombre comercial.')
  if (draft.ruc.trim() && !/^\d{11}$/.test(draft.ruc.trim())) problems.push('El RUC debe tener 11 dígitos.')
  if (!draft.branches.some((branch) => branch.name.trim())) problems.push('Agrega al menos una sede.')
  if (draft.adminDocument.trim() && !/^\d{8}$/.test(draft.adminDocument.trim())) problems.push('El DNI del administrador debe tener 8 dígitos.')
  if (draft.adminDocument.trim() && !draft.adminName.trim()) problems.push('Falta el nombre del administrador.')
  return problems
}
