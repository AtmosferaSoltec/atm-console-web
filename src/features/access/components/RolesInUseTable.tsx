import { EmptyRow } from '@/components/common/EmptyRow'
import { Badge } from '@/components/ui/badge'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { RolesInUseTableProps } from '../types/access.types'

/** The API has no role catalog: a role exists while someone has it, so this counts the roles in use. */
export function RolesInUseTable({ items, isLoading, error }: RolesInUseTableProps) {
  const counts = new Map<string, number>()
  items.forEach((item) => counts.set(item.role, (counts.get(item.role) ?? 0) + 1))
  const roles = [...counts.entries()].sort(([a], [b]) => a.localeCompare(b))

  return (
    <Table>
      <THead>
        <Tr>
          <Th>Rol</Th>
          <Th className="text-right">Usuarios</Th>
        </Tr>
      </THead>
      <TBody>
        {roles.length === 0 && <EmptyRow colSpan={2} message={isLoading ? 'Cargando roles...' : (error ?? 'Todavía no hay roles en uso.')} />}
        {roles.map(([role, count]) => (
          <Tr key={role}>
            <Td>
              <Badge tone="violet" dot={false} className="font-mono">
                {role}
              </Badge>
            </Td>
            <Td className="text-right">{count}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
