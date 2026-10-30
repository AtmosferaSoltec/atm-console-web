import { ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyRow } from '@/components/common/EmptyRow'
import { ListToolbar } from '@/components/common/ListToolbar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TableFooter } from '@/components/common/TableFooter'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { userPath } from '@/config/routes'
import type { AccessItem } from '@/features/access'
import { formatDate } from '@/utils/format'
import type { UsersListProps } from '../types/user.types'

function emptyMessage(isLoading: boolean, error: string | null, total: number): string {
  if (isLoading) return 'Cargando usuarios...'
  if (error) return error
  return total === 0 ? 'Todavía no hay usuarios.' : 'No hay usuarios con esos filtros.'
}

const ALL = 'all'
/** System filter value for users that do not belong to any system. */
const NO_ACCESS = 'none'

function UserAccesses({ accesses, ready }: { accesses: AccessItem[]; ready: boolean }) {
  if (!ready) return <span className="text-slate-300">—</span>
  if (accesses.length === 0) return <span className="text-slate-400">Sin accesos</span>
  return (
    <ul className="space-y-0.5">
      {accesses.map((item) => (
        <li key={item.id} className="text-slate-700">
          <span className="font-medium">{item.systemName}</span>
          <span className="text-slate-400"> · {item.tenantName}</span>
        </li>
      ))}
    </ul>
  )
}

export function UsersList({ users, isLoading, error, access, systems, isAccessLoading, accessError }: UsersListProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(ALL)
  const [systemId, setSystemId] = useState(ALL)
  const [tenantId, setTenantId] = useState(ALL)
  const accessReady = !isAccessLoading && accessError === null

  const accessByUser = useMemo(() => {
    const map = new Map<string, AccessItem[]>()
    for (const item of access) map.set(item.userId, [...(map.get(item.userId) ?? []), item])
    return map
  }, [access])

  const systemOptions = useMemo(
    () => [
      { value: ALL, label: 'Todos los sistemas' },
      { value: NO_ACCESS, label: 'Sin acceso a sistemas' },
      ...systems.map((system) => ({ value: system.id, label: system.name })),
    ],
    [systems],
  )
  // Only companies that have people, so every option returns something.
  const tenantOptions = useMemo(() => {
    const names = new Map<string, string>()
    for (const item of access) names.set(item.tenantId, item.tenantName)
    const sorted = [...names].sort((a, b) => a[1].localeCompare(b[1], 'es'))
    return [{ value: ALL, label: 'Todas las empresas' }, ...sorted.map(([value, label]) => ({ value, label }))]
  }, [access])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return users.filter((user) => {
      if (status !== ALL && user.status !== status) return false
      if (term !== '' && !user.fullName.toLowerCase().includes(term) && !user.dni.includes(term)) return false
      const accesses = accessByUser.get(user.id) ?? []
      if (systemId === NO_ACCESS) return accesses.length === 0
      if (systemId === ALL && tenantId === ALL) return true
      // System and company must match on the same access: someone in Nova at one company and Pulso at another is not "Pulso at the first".
      return accesses.some((item) => (systemId === ALL || item.systemId === systemId) && (tenantId === ALL || item.tenantId === tenantId))
    })
  }, [users, search, status, systemId, tenantId, accessByUser])

  return (
    <Card>
      <ListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por nombre o DNI" status={status} onStatusChange={setStatus}>
        <Select value={systemId} onValueChange={setSystemId} options={systemOptions} aria-label="Sistema" className="sm:w-52" disabled={!accessReady} />
        <Select
          value={systemId === NO_ACCESS ? ALL : tenantId}
          onValueChange={setTenantId}
          options={tenantOptions}
          aria-label="Empresa"
          className="sm:w-52"
          disabled={!accessReady || systemId === NO_ACCESS}
        />
      </ListToolbar>
      {accessError && (
        <p role="alert" className="border-t border-slate-100 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          No se pudieron cargar los accesos: los filtros por sistema y empresa no están disponibles.
        </p>
      )}
      <div className="border-t border-slate-100">
        <Table>
          <THead>
            <Tr>
              <Th>Usuario</Th>
              <Th>DNI</Th>
              <Th>Accesos</Th>
              <Th>Estado</Th>
              <Th>Creado</Th>
              <Th className="w-10" />
            </Tr>
          </THead>
          <TBody>
            {visible.length === 0 && <EmptyRow colSpan={6} message={emptyMessage(isLoading, error, users.length)} />}
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
                  <UserAccesses accesses={accessByUser.get(user.id) ?? []} ready={accessReady} />
                </Td>
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
