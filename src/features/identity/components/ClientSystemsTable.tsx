import { Ban } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatNumber } from '@/utils/format'
import type { ClientSystemsTableProps } from '../types/identity.types'

export function ClientSystemsTable({ systems, onRevoke }: ClientSystemsTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Sistema</Th>
          <Th>Código</Th>
          <Th>Estado</Th>
          <Th>Último uso</Th>
          <Th className="text-right">Consultas del mes</Th>
          <Th className="w-10" />
        </Tr>
      </THead>
      <TBody>
        {systems.map((system) => (
          <Tr key={system.id}>
            <Td className="font-medium text-slate-900">{system.name}</Td>
            <Td className="font-mono text-slate-600">{system.code}</Td>
            <Td>
              <StatusBadge status={system.isActive ? 'active' : 'disabled'} />
            </Td>
            <Td className="text-slate-500">{system.lastUsedAt ?? 'Nunca'}</Td>
            <Td className="text-right tabular-nums">{formatNumber(system.queriesThisMonth)}</Td>
            <Td>
              {system.isActive && (
                <Button variant="danger-ghost" size="icon" title="Desactivar clave" aria-label={`Desactivar clave de ${system.name}`} onClick={() => onRevoke(system)}>
                  <Ban className="size-4" />
                </Button>
              )}
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
