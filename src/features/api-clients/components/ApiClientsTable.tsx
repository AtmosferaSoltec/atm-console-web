import { KeyRound, Power, Webhook } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatNumber } from '@/utils/format'
import type { ApiClientsTableProps } from '../types/apiClient.types'

export function ApiClientsTable({ clients, onConfigureWebhook, onRotateKey, onToggleActive }: ApiClientsTableProps) {
  return (
    <Table className="min-w-[900px]">
      <THead>
        <Tr>
          <Th>Sistema</Th>
          <Th>API key</Th>
          <Th>Estado</Th>
          <Th>Webhook</Th>
          <Th className="text-right">Conexiones</Th>
          <Th className="text-right">Mensajes 24 h</Th>
          <Th className="text-right">Acciones</Th>
        </Tr>
      </THead>
      <TBody>
        {clients.map((client) => (
          <Tr key={client.id}>
            <Td className="font-medium text-slate-900">{client.name}</Td>
            <Td>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">{client.apiKeyPrefix}…</code>
            </Td>
            <Td>
              <Badge tone={client.isActive ? 'success' : 'neutral'}>{client.isActive ? 'Activo' : 'Inactivo'}</Badge>
            </Td>
            <Td className="max-w-[240px]">
              {client.webhookUrl ? (
                <span className="block truncate text-xs text-slate-600" title={client.webhookUrl}>
                  {client.webhookUrl}
                </span>
              ) : (
                <span className="text-slate-400">Sin configurar</span>
              )}
            </Td>
            <Td className="text-right tabular-nums">{client.sessionsCount}</Td>
            <Td className="text-right tabular-nums">{formatNumber(client.messagesLast24h)}</Td>
            <Td>
              <div className="flex items-center justify-end gap-1">
                <Button variant="outline" size="sm" onClick={() => onConfigureWebhook(client)}>
                  <Webhook className="size-4" />
                  Webhook
                </Button>
                <Button variant="ghost" size="icon" title="Rotar API key" aria-label="Rotar API key" onClick={() => onRotateKey(client)}>
                  <KeyRound className="size-4" />
                </Button>
                <Button
                  variant={client.isActive ? 'danger-ghost' : 'ghost'}
                  size="icon"
                  title={client.isActive ? 'Desactivar sistema' : 'Activar sistema'}
                  aria-label={client.isActive ? 'Desactivar sistema' : 'Activar sistema'}
                  onClick={() => onToggleActive(client)}
                >
                  <Power className="size-4" />
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
