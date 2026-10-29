import { Send } from 'lucide-react'
import { CopyField } from '@/components/common/CopyField'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { BadgeTone } from '@/types/ui.types'
import { useWebhookEvents } from '../hooks/useApiClients'
import type { WebhookDialogProps, WebhookEventStatus } from '../types/apiClient.types'

const EVENT_BADGES: Record<WebhookEventStatus, { label: string; tone: BadgeTone }> = {
  delivered: { label: 'Entregado', tone: 'success' },
  pending: { label: 'Reintentando', tone: 'warning' },
  failed: { label: 'Falló', tone: 'danger' },
}

export function WebhookDialog({ client, onClose }: WebhookDialogProps) {
  const events = useWebhookEvents()

  return (
    <Dialog
      open={client !== null}
      onClose={onClose}
      size="lg"
      title={client ? `Webhook de ${client.name}` : 'Webhook'}
      description="Recibe avisos cuando un mensaje se envía, se entrega o se lee, y cuando una conexión cambia de estado."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={onClose}>Guardar</Button>
        </>
      }
    >
      {client && (
        <div key={client.id} className="space-y-5">
          <div>
            <Label htmlFor="webhook-url">URL de destino</Label>
            <div className="flex gap-2">
              <Input id="webhook-url" defaultValue={client.webhookUrl ?? ''} placeholder="https://tu-sistema.com/webhooks/mensajeria" />
              <Button variant="outline" className="shrink-0" disabled={!client.webhookUrl}>
                <Send className="size-4" />
                Enviar prueba
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">Déjala vacía y guarda para desactivar los webhooks de este sistema.</p>
          </div>

          <div>
            <Label>Secreto de firma</Label>
            <CopyField value={client.webhookSecret} />
            <p className="mt-1.5 text-xs text-slate-500">
              Cada aviso viaja firmado con HMAC-SHA256 en la cabecera <code className="font-mono">X-Signature</code>.
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Últimos envíos</p>
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {events.map((event) => {
                const badge = EVENT_BADGES[event.status]
                return (
                  <li key={event.id} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[13px] text-slate-800">{event.type}</p>
                      <p className="text-xs text-slate-400">
                        {event.when} · {event.attempts} {event.attempts === 1 ? 'intento' : 'intentos'}
                        {event.lastError && <span className="text-red-500"> · {event.lastError}</span>}
                      </p>
                    </div>
                    <Badge tone={badge.tone}>{badge.label}</Badge>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </Dialog>
  )
}
