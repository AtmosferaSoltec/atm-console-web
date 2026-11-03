import { useMemo, useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyRow } from '@/components/common/EmptyRow'
import { ListToolbar } from '@/components/common/ListToolbar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TableFooter } from '@/components/common/TableFooter'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { useUserActions } from '@/features/users'
import { formatDate } from '@/utils/format'
import type { OrbitaPeopleListProps, OrbitaPerson } from '../types/orbita.types'

function emptyMessage(isLoading: boolean, error: string | null, total: number): string {
  if (isLoading) return 'Cargando personas...'
  if (error) return error
  return total === 0 ? 'Todavía no hay personas en Orbita.' : 'No hay personas con esos filtros.'
}

export function OrbitaPeopleList({ people, isLoading, error, onChanged }: OrbitaPeopleListProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [pending, setPending] = useState<OrbitaPerson | null>(null)
  const { setStatus: updateStatus, isWorking, notice, error: actionError } = useUserActions()

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return people.filter((person) => {
      if (status !== 'all' && person.status !== status) return false
      return term === '' || person.name.toLowerCase().includes(term) || person.email.toLowerCase().includes(term)
    })
  }, [people, search, status])

  const disabling = pending?.status === 'active'

  const handleConfirm = async () => {
    const person = pending
    setPending(null)
    if (!person) return
    const ok = await updateStatus(person.userId, person.status === 'active' ? 'disabled' : 'active')
    if (ok) onChanged()
  }

  return (
    <Card>
      <ListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por nombre o correo" status={status} onStatusChange={setStatus} />
      {(notice || actionError) && (
        <p role={actionError ? 'alert' : 'status'} className={actionError ? 'px-5 pb-3 text-sm text-red-600' : 'px-5 pb-3 text-sm text-emerald-600'}>
          {actionError ?? notice}
        </p>
      )}
      <div className="border-t border-slate-100">
        <Table>
          <THead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Correo</Th>
              <Th>Estado</Th>
              <Th>Se unió</Th>
              <Th className="w-32" />
            </Tr>
          </THead>
          <TBody>
            {visible.length === 0 && <EmptyRow colSpan={5} message={emptyMessage(isLoading, error, people.length)} />}
            {visible.map((person) => (
              <Tr key={person.userId}>
                <Td className="font-medium text-slate-900">{person.name || '—'}</Td>
                <Td className="text-slate-600">{person.email || '—'}</Td>
                <Td>{person.status ? <StatusBadge status={person.status} /> : <span className="text-slate-400">—</span>}</Td>
                <Td className="text-slate-500">{formatDate(new Date(person.joinedAt))}</Td>
                <Td>
                  {person.status && (
                    <Button variant={person.status === 'active' ? 'danger' : 'outline'} disabled={isWorking} onClick={() => setPending(person)}>
                      {person.status === 'active' ? 'Desactivar' : 'Activar'}
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
      <TableFooter shown={visible.length} total={people.length} noun="personas" />
      <ConfirmDialog
        open={pending !== null}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title={disabling ? 'Desactivar cuenta' : 'Activar cuenta'}
        description={
          disabling
            ? `${pending?.name || pending?.email} no podrá ingresar a ningún sistema y se cerrarán sus sesiones.`
            : `${pending?.name || pending?.email} podrá volver a ingresar a los sistemas donde tiene acceso.`
        }
        confirmLabel={disabling ? 'Desactivar' : 'Activar'}
        destructive={disabling}
      />
    </Card>
  )
}
