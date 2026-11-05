import { Link } from 'react-router-dom'
import { EmptyRow } from '@/components/common/EmptyRow'
import { FilterChips } from '@/components/common/FilterChips'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { collectionsClientPath } from '@/config/routes'
import { formatMoney } from '@/utils/format'
import type { ChargeFilterBarProps, ChargesTableProps, ChargeStatus } from '../types/collections.types'
import { formatPeriod } from '../utils/period'
import { ChargeStatusBadge } from './CollectionBadges'

const FILTERS: { value: ChargeStatus; label: string }[] = [
  { value: 'pending', label: 'Pendientes' },
  { value: 'paid', label: 'Pagados' },
]

/** Two chips, pending and paid, with the number of charges in each. */
export function ChargeFilterBar({ charges, value, onChange }: ChargeFilterBarProps) {
  const options = FILTERS.map((filter) => ({ ...filter, count: charges.filter((charge) => charge.status === filter.value).length }))
  return <FilterChips options={options} value={value} onChange={(next) => onChange(next as ChargeStatus)} />
}

/** Period, service, amount and status: nothing else. */
export function ChargesTable({ charges, emptyMessage, showClient = false, selection, oldestFirst = false }: ChargesTableProps) {
  const columns = 4 + (showClient ? 1 : 0) + (selection ? 1 : 0)
  const rows = [...charges].sort((a, b) => (oldestFirst ? a.period.localeCompare(b.period) : b.period.localeCompare(a.period)))
  const allSelected = selection !== undefined && rows.length > 0 && rows.every((charge) => selection.selected.has(charge.id))

  return (
    <Table>
      <THead>
        <Tr>
          {selection && (
            <Th className="w-12 pr-0">
              <input
                type="checkbox"
                aria-label="Elegir todos"
                checked={allSelected}
                onChange={(event) => selection.onToggleAll(event.target.checked)}
                className="size-4 cursor-pointer align-middle accent-brand-600"
              />
            </Th>
          )}
          <Th>Periodo</Th>
          {showClient && <Th>Cliente</Th>}
          <Th>Servicio</Th>
          <Th>Monto</Th>
          <Th>Estado</Th>
        </Tr>
      </THead>
      <TBody>
        {rows.length === 0 && <EmptyRow colSpan={columns} message={emptyMessage} />}
        {rows.map((charge) => (
          <Tr key={charge.id} className={selection?.selected.has(charge.id) ? 'bg-brand-50/40' : undefined}>
            {selection && (
              <Td className="pr-0">
                <input
                  type="checkbox"
                  aria-label={`Elegir ${formatPeriod(charge.period)} · ${charge.concept}`}
                  checked={selection.selected.has(charge.id)}
                  onChange={() => selection.onToggle(charge.id)}
                  className="size-4 cursor-pointer align-middle accent-brand-600"
                />
              </Td>
            )}
            <Td className="font-medium whitespace-nowrap text-slate-900">{formatPeriod(charge.period)}</Td>
            {showClient && (
              <Td className="max-w-64">
                {charge.clientId ? (
                  <Link to={collectionsClientPath(charge.clientId)} title={charge.clientName} className="block truncate font-medium text-slate-900 hover:text-brand-700">
                    {charge.clientName}
                  </Link>
                ) : (
                  '—'
                )}
              </Td>
            )}
            <Td className="max-w-56 truncate" title={charge.concept}>
              {charge.concept}
            </Td>
            <Td className="whitespace-nowrap">{formatMoney(charge.amount, charge.currency)}</Td>
            <Td>
              <ChargeStatusBadge status={charge.status} />
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
