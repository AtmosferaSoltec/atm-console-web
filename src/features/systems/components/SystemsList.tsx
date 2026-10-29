import { ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyRow } from '@/components/common/EmptyRow'
import { ListToolbar } from '@/components/common/ListToolbar'
import { TableFooter } from '@/components/common/TableFooter'
import { Card } from '@/components/ui/card'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { systemPath } from '@/config/routes'
import { formatDate } from '@/utils/format'
import type { SystemsListProps } from '../types/system.types'
import { SessionBadge } from './SessionBadge'

function emptyMessage(isLoading: boolean, error: string | null, total: number): string {
  if (isLoading) return 'Cargando sistemas...'
  if (error) return error
  return total === 0 ? 'Todavía no hay sistemas.' : 'No hay sistemas con esos filtros.'
}

export function SystemsList({ systems, isLoading, error }: SystemsListProps) {
  const [search, setSearch] = useState('')

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return systems.filter((system) => term === '' || system.name.toLowerCase().includes(term) || system.code.includes(term))
  }, [systems, search])

  return (
    <Card>
      <ListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por nombre o código" />
      <div className="border-t border-slate-100">
        <Table>
          <THead>
            <Tr>
              <Th>Sistema</Th>
              <Th>Sesión</Th>
              <Th>Creado</Th>
              <Th className="w-10" />
            </Tr>
          </THead>
          <TBody>
            {visible.length === 0 && <EmptyRow colSpan={4} message={emptyMessage(isLoading, error, systems.length)} />}
            {visible.map((system) => (
              <Tr key={system.id}>
                <Td>
                  <Link to={systemPath(system.id)} className="font-medium text-slate-900 hover:text-brand-700">
                    {system.name}
                  </Link>
                  <span className="block font-mono text-xs text-slate-500">{system.code}</span>
                </Td>
                <Td>
                  <SessionBadge mode={system.sessionMode} minutes={system.sessionMinutes} />
                </Td>
                <Td className="text-slate-500">{formatDate(new Date(system.createdAt))}</Td>
                <Td>
                  <Link to={systemPath(system.id)} aria-label={`Ver ${system.name}`} className="text-slate-300 transition hover:text-slate-600">
                    <ChevronRight className="size-4" />
                  </Link>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
      <TableFooter shown={visible.length} total={systems.length} noun="sistemas" />
    </Card>
  )
}
