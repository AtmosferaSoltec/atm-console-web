import { ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyRow } from '@/components/common/EmptyRow'
import { ListToolbar } from '@/components/common/ListToolbar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TableFooter } from '@/components/common/TableFooter'
import { Card } from '@/components/ui/card'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { userPath } from '@/config/routes'
import { formatDate } from '@/utils/format'
import type { UsersListProps } from '../types/user.types'

function emptyMessage(isLoading: boolean, error: string | null, total: number): string {
  if (isLoading) return 'Cargando usuarios...'
  if (error) return error
  return total === 0 ? 'Todavía no hay usuarios.' : 'No hay usuarios con esos filtros.'
}

export function UsersList({ users, isLoading, error }: UsersListProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return users.filter((user) => (status === 'all' || user.status === status) && (term === '' || user.fullName.toLowerCase().includes(term) || user.dni.includes(term)))
  }, [users, search, status])

  return (
    <Card>
      <ListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por nombre o DNI" status={status} onStatusChange={setStatus} />
      <div className="border-t border-slate-100">
        <Table>
          <THead>
            <Tr>
              <Th>Usuario</Th>
              <Th>DNI</Th>
              <Th>Estado</Th>
              <Th>Creado</Th>
              <Th className="w-10" />
            </Tr>
          </THead>
          <TBody>
            {visible.length === 0 && <EmptyRow colSpan={5} message={emptyMessage(isLoading, error, users.length)} />}
            {visible.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <Link to={userPath(user.id)} className="flex items-center gap-3 font-medium text-slate-900 hover:text-brand-700">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {user.fullName.charAt(0)}
                    </span>
                    {user.fullName}
                  </Link>
                </Td>
                <Td className="font-mono text-slate-600">{user.dni}</Td>
                <Td>
                  <StatusBadge status={user.status} />
                  {user.mustChangePassword && <span className="ml-2 text-xs text-amber-600">Contraseña pendiente</span>}
                </Td>
                <Td className="text-slate-500">{formatDate(new Date(user.createdAt))}</Td>
                <Td>
                  <Link to={userPath(user.id)} aria-label={`Ver ${user.fullName}`} className="text-slate-300 transition hover:text-slate-600">
                    <ChevronRight className="size-4" />
                  </Link>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
      <TableFooter shown={visible.length} total={users.length} noun="usuarios" />
    </Card>
  )
}
