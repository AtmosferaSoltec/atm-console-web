import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useApiClients } from '@/features/api-clients'
import type { SelectOption } from '@/types/ui.types'
import type { MessageFiltersProps } from '../types/message.types'
import { STATUS_BADGES } from './MessageBadges'

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todos los estados' },
  ...Object.entries(STATUS_BADGES).map(([value, { label }]) => ({ value, label })),
]

const PRIORITY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Toda prioridad' },
  { value: 'transactional', label: 'Transaccional' },
  { value: 'promotional', label: 'Promocional' },
]

export function MessageFilters({ value, onChange }: MessageFiltersProps) {
  const clients = useApiClients()
  const clientOptions: SelectOption[] = [{ value: 'all', label: 'Todos los sistemas' }, ...clients.map((client) => ({ value: client.name, label: client.name }))]

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
      <div className="flex-1">
        <Input
          leadingIcon={Search}
          placeholder="Buscar por número"
          aria-label="Buscar mensajes por número"
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
        />
      </div>
      <Select className="lg:w-44" aria-label="Estado" value={value.status} onValueChange={(status) => onChange({ ...value, status })} options={STATUS_OPTIONS} />
      <Select className="lg:w-44" aria-label="Prioridad" value={value.priority} onValueChange={(priority) => onChange({ ...value, priority })} options={PRIORITY_OPTIONS} />
      <Select className="lg:w-44" aria-label="Sistema" value={value.clientName} onValueChange={(clientName) => onChange({ ...value, clientName })} options={clientOptions} />
    </div>
  )
}
