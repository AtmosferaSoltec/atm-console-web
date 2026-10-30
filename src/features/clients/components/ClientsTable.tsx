import { Pencil, Trash2 } from 'lucide-react'
import { EmptyRow } from '@/components/common/EmptyRow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatDate } from '@/utils/format'
import type { ClientsTableProps } from '../types/client.types'

export function ClientsTable({ clients, emptyMessage, onRename, onDelete }: ClientsTableProps) {
  return (
    <Table className="min-w-[720px]">
      <THead>
        <Tr>
          <Th>Cliente</Th>
          <Th>Empresas</Th>
          <Th>Creado</Th>
          <Th className="w-24" />
        </Tr>
      </THead>
      <TBody>
        {clients.length === 0 && <EmptyRow colSpan={4} message={emptyMessage} />}
        {clients.map((client) => (
          <Tr key={client.id}>
            <Td className="font-medium text-slate-900">{client.name}</Td>
            <Td>
              {client.tenants.length === 0 ? (
                <span className="text-slate-400">Sin empresas</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {client.tenants.map((tenant) => (
                    <Badge key={tenant.id} tone="info" dot={false}>
                      {tenant.displayName}
                    </Badge>
                  ))}
                </div>
              )}
            </Td>
            <Td className="text-slate-500">{formatDate(new Date(client.createdAt))}</Td>
            <Td>
              <span className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" aria-label={`Renombrar a ${client.name}`} title="Renombrar" onClick={() => onRename(client)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Eliminar a ${client.name}`}
                  title={client.tenants.length > 0 ? 'Mueve sus empresas antes de eliminarlo' : 'Eliminar'}
                  disabled={client.tenants.length > 0}
                  onClick={() => onDelete(client)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </span>
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
