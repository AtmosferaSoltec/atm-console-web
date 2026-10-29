import { ApiError } from '@/services/httpClient'

const ERROR_MESSAGES: Record<string, string> = {
  role_exists: 'Este sistema ya tiene un rol con ese nombre.',
  invalid_role_name: 'El nombre del rol es obligatorio y puede tener hasta 64 caracteres.',
  invalid_role_description: 'La descripción puede tener hasta 200 caracteres.',
  role_in_use: 'Todavía hay personas con este rol. Cámbiales el rol o quítales el acceso primero.',
  role_not_found: 'Este rol ya no existe.',
}

export function roleErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return ERROR_MESSAGES[error.code] ?? fallback
  return 'No se pudo conectar con el servidor.'
}
