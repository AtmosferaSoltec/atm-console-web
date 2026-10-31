import { endOfDay, startOfDay, startOfMonth, subDays } from 'date-fns'
import { Search } from 'lucide-react'
import { FilterField } from '@/components/common/FilterField'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { DOCUMENT_TYPE_LABELS } from '@/config/labels'
import { useCompanies } from '@/features/companies'
import type { DateRangePreset, SelectOption } from '@/types/ui.types'
import { EMPTY_DOCUMENT_FILTERS } from '../services/documentService'
import type { DocumentFiltersKind, DocumentFiltersProps } from '../types/document.types'
import { DOCUMENT_STATUS_BADGES } from './DocumentStatusBadge'

const RANGE_PRESETS: DateRangePreset[] = [
  { label: 'Hoy', getRange: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: 'Últimos 7 días', getRange: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: 'Este mes', getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
]

const TYPE_KEYS: Record<DocumentFiltersKind, (keyof typeof DOCUMENT_TYPE_LABELS)[]> = {
  invoices: ['FACTURA', 'BOLETA'],
  guides: ['GRE_REMITENTE', 'GRE_TRANSPORTISTA'],
}

const STATUS_KEYS: Record<DocumentFiltersKind, (keyof typeof DOCUMENT_STATUS_BADGES)[]> = {
  invoices: ['PENDING', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'VOID_SUBMITTED', 'VOIDED', 'NEEDS_REVIEW'],
  guides: ['PENDING', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'NEEDS_REVIEW'],
}

const ACCOUNT_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todas' },
  { value: 'production', label: 'Producción' },
  { value: 'test', label: 'Pruebas' },
]

export function DocumentFilters({ kind, value, onChange }: DocumentFiltersProps) {
  const { items: companies } = useCompanies()

  const companyOptions: SelectOption[] = [{ value: 'all', label: 'Todas' }, ...companies.map((company) => ({ value: company.id, label: company.name }))]
  const typeOptions: SelectOption[] = [{ value: 'all', label: 'Todos' }, ...TYPE_KEYS[kind].map((type) => ({ value: type, label: DOCUMENT_TYPE_LABELS[type] }))]
  const statusOptions: SelectOption[] = [{ value: 'all', label: 'Todos' }, ...STATUS_KEYS[kind].map((status) => ({ value: status, label: DOCUMENT_STATUS_BADGES[status].label }))]

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 p-4">
      <FilterField label="Empresa" htmlFor="filter-company">
        <Select id="filter-company" className="w-56" value={value.companyId} onValueChange={(companyId) => onChange({ ...value, companyId })} options={companyOptions} />
      </FilterField>
      <FilterField label="Tipo" htmlFor="filter-type">
        <Select id="filter-type" className="w-40" value={value.documentType} onValueChange={(documentType) => onChange({ ...value, documentType })} options={typeOptions} />
      </FilterField>
      <FilterField label="Estado" htmlFor="filter-status">
        <Select id="filter-status" className="w-48" value={value.status} onValueChange={(status) => onChange({ ...value, status })} options={statusOptions} />
      </FilterField>
      <FilterField label="Cuenta" htmlFor="filter-account">
        <Select id="filter-account" className="w-36" value={value.account} onValueChange={(account) => onChange({ ...value, account })} options={ACCOUNT_OPTIONS} />
      </FilterField>
      <FilterField label="Fechas" htmlFor="filter-range">
        <DateRangePicker value={value.range} onChange={(range) => onChange({ ...value, range })} presets={RANGE_PRESETS} placeholder="Todas las fechas" className="w-64" />
      </FilterField>
      <FilterField label="Buscar" htmlFor="filter-search">
        <Input
          id="filter-search"
          leadingIcon={Search}
          className="w-64"
          placeholder={kind === 'invoices' ? 'F001-123, RUC/DNI o cliente' : 'T001-123, cliente o destinatario'}
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
        />
      </FilterField>
      <Button variant="ghost" onClick={() => onChange(EMPTY_DOCUMENT_FILTERS)}>
        Limpiar
      </Button>
    </div>
  )
}
