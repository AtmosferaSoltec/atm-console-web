import { ApiError } from '@/services/httpClient'

const ERROR_MESSAGES: Record<string, string> = {
  invalid_name: 'El nombre es obligatorio.',
  name_too_long: 'El nombre supera el largo permitido.',
  client_not_found: 'No se encontró el cliente.',
  client_has_tenants: 'El cliente todavía tiene empresas. Muévelas a otro cliente primero.',
}

export function clientErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return ERROR_MESSAGES[error.code] ?? fallback
  return 'No se pudo conectar con el servidor.'
}
