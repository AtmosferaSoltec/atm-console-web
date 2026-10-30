import { Plus, Power, Webhook } from 'lucide-react'
import { EmptyRow } from '@/components/common/EmptyRow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatNumber } from '@/utils/format'
import type { MessagingSystem, MessagingSystemsTableProps } from '../types/messagingSystem.types'

function emptyMessage(isLoading: boolean, error: string | null): string {
  if (isLoading) return 'Cargando sistemas...'
  return error ?? 'Todavía no hay sistemas registrados.'
}

function StatusBadge({ system }: { system: MessagingSystem }) {
  if (system.tenantId === null) return <Badge tone="neutral">Sin uso aún</Badge>
  return <Badge tone={system.isActive ? 'success' : 'warning'}>{system.isActive ? 'Activo' : 'Inactivo'}</Badge>
}

export function MessagingSystemsTable({ systems, isLoading, error, onEnable, onConfigureWebhook, onToggleActive }: MessagingSystemsTableProps) {
  return (
    <Table className="min-w-[900px]">
      <THead>
        <Tr>
          <Th>Sistema</Th>
          <Th>Estado</Th>
          <Th>Webhook</Th>
          <Th className="text-right">Conexiones</Th>
          <Th className="text-right">Mensajes 24 h</Th>
          <Th className="text-right">Acciones</Th>
        </Tr>
      </THead>
      <TBody>
        {systems.length === 0 && <EmptyRow colSpan={6} message={emptyMessage(isLoading, error)} />}
        {systems.map((system) => (
          <Tr key={system.code}>
            <Td>
              <span className="font-medium text-slate-900">{system.name}</span>
              <span className="block font-mono text-xs text-slate-500">{system.code}</span>
            </Td>
            <Td>
              <StatusBadge system={system} />
            </Td>
            <Td className="max-w-[240px]">
              {system.webhookUrl ? (
                <span className="block truncate text-xs text-slate-600" title={system.webhookUrl}>
                  {system.webhookUrl}
                </span>
              ) : (
                <span className="text-slate-400">Sin configurar</span>
              )}
            </Td>
            <Td className="text-right tabular-nums">{system.sessionsCount}</Td>
            <Td className="text-right tabular-nums">{formatNumber(system.messagesLast24h)}</Td>
            <Td>
              <div className="flex items-center justify-end gap-1">
                {system.tenantId === null ? (
                  <Button variant="outline" size="sm" onClick={() => onEnable(system)}>
                    <Plus className="size-4" />
                    Habilitar
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => onConfigureWebhook(system)}>
                      <Webhook className="size-4" />
                      Webhook
                    </Button>
                    <Button
                      variant={system.isActive ? 'danger-ghost' : 'ghost'}
                      size="icon"
                      title={system.isActive ? 'Desactivar en mensajería' : 'Activar en mensajería'}
                      aria-label={system.isActive ? 'Desactivar en mensajería' : 'Activar en mensajería'}
                      onClick={() => onToggleActive(system)}
                    >
                      <Power className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
