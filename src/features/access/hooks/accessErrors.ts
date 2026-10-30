import { ApiError } from '@/services/httpClient'

const ERROR_MESSAGES: Record<string, string> = {
  user_already_in_system: 'El usuario ya tiene acceso a esta empresa en este sistema.',
  system_not_enabled_for_tenant: 'Esa empresa no tiene contratado este sistema.',
  unknown_role: 'Ese rol ya no existe en el sistema. Elige otro.',
  invalid_role: 'El rol es obligatorio y puede tener hasta 64 caracteres.',
  user_not_found: 'No se encontró el usuario.',
  access_not_found: 'Ese acceso ya no existe.',
}

export function accessErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return ERROR_MESSAGES[error.code] ?? fallback
  return 'No se pudo conectar con el servidor.'
}
