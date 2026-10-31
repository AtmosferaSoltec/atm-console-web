import { accessErrorMessage } from '@/features/access'
import { tenantErrorMessage } from '@/features/tenants'
import { userErrorMessage } from '@/features/users'
import { ApiError } from '@/services/httpClient'

const ERROR_MESSAGES: Record<string, string> = {
  BRANCH_IN_USE: 'Esta sede ya tiene movimientos y no se puede eliminar.',
  GROUP_IN_USE: 'El grupo todavía tiene gimnasios. Muévelos a otro grupo primero.',
  SCOPE_NOT_ALLOWED: 'El grupo elegido ya no existe.',
  FEATURES_INVALID: 'Alguno de los módulos elegidos no existe.',
  VALIDATION_FAILED: 'Revisa los datos ingresados.',
  NOT_FOUND: 'El elemento ya no existe.',
  FORBIDDEN: 'No tienes permiso para esta acción.',
}

/** Pulso's own errors first, then the auth API's (companies, people, access). */
export function pulsoErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return 'No se pudo conectar con el servidor.'
  return ERROR_MESSAGES[error.code] ?? (accessErrorMessage(error, '') || userErrorMessage(error, '') || tenantErrorMessage(error, '') || fallback)
}
