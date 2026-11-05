import { HandCoins } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyRow } from '@/components/common/EmptyRow'
import { ListToolbar } from '@/components/common/ListToolbar'
import { TableFooter } from '@/components/common/TableFooter'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { collectionsChargesPath, collectionsClientPath } from '@/config/routes'
import type { ClientAccountsListProps } from '../types/collections.types'
import { ACCOUNT_STATUS_FILTER_OPTIONS } from '../utils/labels'
import { formatIsoDate } from '../utils/period'
import { AccountStatusBadge } from './CollectionBadges'
import { MoneyBalances } from './MoneyBalances'
import { NewChargeAction } from './NewChargeAction'

export function ClientAccountsList({ clients, isLoading, error, onChanged }: ClientAccountsListProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const navigate = useNavigate()

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return clients.filter((client) => {
      if (status !== 'all' && client.status !== status) return false
      return term === '' || [client.name, client.ruc ?? ''].some((text) => text.toLowerCase().includes(term))
    })
  }, [clients, search, status])

  const emptyMessage = isLoading
    ? 'Cargando clientes...'
    : (error ?? (clients.length === 0 ? 'Todavía no hay clientes. Agrega el primero con "Nuevo cliente".' : 'No hay clientes con esos filtros.'))

  return (
    <Card>
      <ListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por nombre o RUC">
        <Select value={status} onValueChange={setStatus} options={ACCOUNT_STATUS_FILTER_OPTIONS} aria-label="Estado" className="sm:w-48" />
      </ListToolbar>
      <div className="border-t border-slate-100">
        <Table>
          <THead>
            <Tr>
              <Th>Cliente</Th>
              <Th>RUC</Th>
              <Th>Saldo pendiente</Th>
              <Th>Último pago</Th>
              <Th>Estado</Th>
              <Th className="w-56" />
            </Tr>
          </THead>
          <TBody>
            {visible.length === 0 && <EmptyRow colSpan={6} message={emptyMessage} />}
            {visible.map((client) => (
              <Tr key={client.id}>
                <Td className="max-w-xs">
                  <Link to={collectionsClientPath(client.id)} title={client.name} className="block truncate font-medium text-slate-900 hover:text-brand-700">
                    {client.name}
                  </Link>
                </Td>
                <Td className="whitespace-nowrap text-slate-500">{client.ruc ?? '—'}</Td>
                <Td>
                  <MoneyBalances amounts={client.balance} emptyLabel="Sin deuda" />
                </Td>
                <Td className="whitespace-nowrap text-slate-500">{formatIsoDate(client.lastPaymentOn)}</Td>
                <Td>
                  <AccountStatusBadge status={client.status} />
                </Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    {client.status === 'pending' && (
                      <Button size="sm" onClick={() => navigate(collectionsChargesPath(client.id))}>
                        <HandCoins className="size-4" />
                        Cobrar
                      </Button>
                    )}
                    <NewChargeAction compact clients={[client]} clientId={client.id} onCreated={onChanged} />
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
      <TableFooter shown={visible.length} total={clients.length} noun="clientes" />
    </Card>
  )
}
