import { Link2, Send, Trash2, Unlink } from 'lucide-react'
import { EmptyRow } from '@/components/common/EmptyRow'
import { Button } from '@/components/ui/button'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatDateTime, formatPhone } from '@/utils/format'
import type { SessionsTableProps } from '../types/session.types'
import { AccountAvatar } from './AccountAvatar'
import { SessionStatusBadge } from './SessionStatusBadge'

function emptyMessage(isLoading: boolean, error: string | null): string {
  if (isLoading) return 'Cargando conexiones...'
  return error ?? 'Ninguna conexión con este estado.'
}

export function SessionsTable({ sessions, isLoading, error, onGenerateLink, onSendMessage, onDisconnect, onDelete }: SessionsTableProps) {
  return (
    <Table className="min-w-[900px]">
      <THead>
        <Tr>
          <Th>Empresa</Th>
          <Th>Sistema</Th>
          <Th>Estado</Th>
          <Th>Número</Th>
          <Th>Última conexión</Th>
          <Th className="text-right">Acciones</Th>
        </Tr>
      </THead>
      <TBody>
        {sessions.length === 0 && <EmptyRow colSpan={6} message={emptyMessage(isLoading, error)} />}
        {sessions.map((session) => (
          <Tr key={session.id}>
            <Td>
              <div className="flex items-center gap-3">
                <AccountAvatar name={session.accountRef} />
                <p className="min-w-0 truncate font-medium text-slate-900">{session.accountRef}</p>
              </div>
            </Td>
            <Td>{session.clientName}</Td>
            <Td>
              <SessionStatusBadge status={session.status} />
            </Td>
            <Td className="whitespace-nowrap">{session.phone ? formatPhone(session.phone) : <span className="text-slate-400">Sin vincular</span>}</Td>
            <Td className="whitespace-nowrap text-slate-500">{session.connectedAt ? formatDateTime(new Date(session.connectedAt)) : '—'}</Td>
            <Td>
              <div className="flex items-center justify-end gap-1">
                <Button variant="outline" size="sm" onClick={() => onGenerateLink(session)}>
                  <Link2 className="size-4" />
                  Generar link
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title={session.status === 'connected' ? 'Enviar mensaje de prueba' : 'La conexión debe estar activa para enviar'}
                  aria-label="Enviar mensaje de prueba"
                  disabled={session.status !== 'connected'}
                  onClick={() => onSendMessage(session)}
                >
                  <Send className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Desvincular número"
                  aria-label="Desvincular número"
                  disabled={session.status === 'pending_qr'}
                  onClick={() => onDisconnect(session)}
                >
                  <Unlink className="size-4" />
                </Button>
                <Button variant="danger-ghost" size="icon" title="Eliminar conexión" aria-label="Eliminar conexión" onClick={() => onDelete(session)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
