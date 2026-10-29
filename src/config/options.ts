import type { SelectOption } from '@/types/ui.types'

export const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'disabled', label: 'Deshabilitados' },
]
