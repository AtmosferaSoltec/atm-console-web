import { ApiError } from '@/services/httpClient'

const ERROR_MESSAGES: Record<string, string> = {
  dni_taken: 'Ya existe un usuario con ese número de documento.',
  document_taken: 'Ya existe un usuario con ese número de documento.',
  invalid_dni: 'El DNI debe tener 8 dígitos.',
  invalid_document: 'El documento no es válido: un DNI tiene 8 dígitos, un carné de extranjería de 9 a 12 y un pasaporte de 6 a 12 letras o números.',
  no_document: 'Esta cuenta no tiene documento: no se puede restablecer su contraseña.',
  invalid_full_name: 'El nombre completo es obligatorio.',
  weak_password: 'La contraseña debe tener al menos 8 caracteres.',
  user_not_found: 'No se encontró el usuario.',
}

export function userErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return ERROR_MESSAGES[error.code] ?? fallback
  return 'No se pudo conectar con el servidor.'
}
