import { ApiError } from '@/services/httpClient'
import { formatBytes } from '@/utils/format'
import { MAX_LOGO_BYTES, MAX_UPLOAD_BYTES } from '../services/storageService'

const ERROR_MESSAGES: Record<string, string> = {
  invalid_input: 'Los datos del archivo no son válidos.',
  file_too_large: `El archivo supera el límite permitido (${formatBytes(MAX_UPLOAD_BYTES)}, o ${formatBytes(MAX_LOGO_BYTES)} para logos).`,
  unsupported_media_type: 'El logo debe ser una imagen PNG o JPEG válida.',
  provider_unavailable: 'El almacenamiento no está disponible en este momento. Intenta más tarde.',
  file_not_found: 'El archivo ya no existe.',
  forbidden: 'No tienes permiso para esta acción.',
}

export function storageErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return ERROR_MESSAGES[error.code] ?? fallback
  return 'No se pudo conectar con el servicio de almacenamiento.'
}
