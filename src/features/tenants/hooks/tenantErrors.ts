import { ApiError } from '@/services/httpClient'

const ERROR_MESSAGES: Record<string, string> = {
  ruc_taken: 'Ya existe una empresa con ese RUC.',
  invalid_ruc: 'El RUC debe tener 11 dígitos.',
  invalid_legal_name: 'La razón social es obligatoria.',
  tenant_not_found: 'No se encontró la empresa.',
}

export function tenantErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return ERROR_MESSAGES[error.code] ?? fallback
  return 'No se pudo conectar con el servidor.'
}
