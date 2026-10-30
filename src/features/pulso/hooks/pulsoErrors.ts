import { ApiError } from '@/services/httpClient'

const ERROR_MESSAGES: Record<string, string> = {
  BRANCH_IN_USE: 'Esta sede ya tiene movimientos y no se puede eliminar.',
  VALIDATION_FAILED: 'Revisa los datos de la sede.',
  NOT_FOUND: 'La sede o el gimnasio ya no existe.',
  FORBIDDEN: 'No tienes permiso para esta acción.',
}

export function pulsoErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return ERROR_MESSAGES[error.code] ?? fallback
  return 'No se pudo conectar con Pulso.'
}
