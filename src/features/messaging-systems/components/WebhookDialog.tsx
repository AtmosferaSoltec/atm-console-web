import { Send } from 'lucide-react'
import { useState } from 'react'
import { CopyField } from '@/components/common/CopyField'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { BadgeTone } from '@/types/ui.types'
import { formatDateTime } from '@/utils/format'
import { useSaveWebhook, useSendWebhookTest, useWebhookConfig, useWebhookEvents } from '../hooks/useWebhook'
import type { WebhookDialogProps, WebhookEventStatus } from '../types/messagingSystem.types'

const EVENT_BADGES: Record<WebhookEventStatus, { label: string; tone: BadgeTone }> = {
  delivered: { label: 'Entregado', tone: 'success' },
  pending: { label: 'Reintentando', tone: 'warning' },
  failed: { label: 'Falló', tone: 'danger' },
}

interface WebhookFormProps {
  tenantId: string
  onClose: () => void
  onSaved: () => void
}

function WebhookForm({ tenantId, onClose, onSaved }: WebhookFormProps) {
  const config = useWebhookConfig(tenantId)
  const events = useWebhookEvents(tenantId)
  const save = useSaveWebhook(tenantId)
  const test = useSendWebhookTest(tenantId)
  // The field follows the saved URL until the operator types.
  const [typed, setTyped] = useState<string | null>(null)
  const [testSent, setTestSent] = useState(false)
  const url = typed ?? config.data?.url ?? ''

  const handleSave = async () => {
    if ((await save.run(url.trim())) === null) return
    onSaved()
    onClose()
  }

  const handleTest = async () => {
    setTestSent(false)
    if ((await test.run()) === null) return
    setTestSent(true)
    events.reload()
  }

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title="Webhook"
      description="Recibe avisos cuando un mensaje se envía, se entrega o se lee, y cuando una conexión cambia de estado."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleSave} disabled={save.isWorking || config.isLoading}>
            {save.isWorking ? 'Guardando...' : 'Guardar'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="webhook-url">URL de destino</Label>
          <div className="flex gap-2">
            <Input
              id="webhook-url"
              value={url}
              onChange={(event) => setTyped(event.target.value)}
              placeholder="https://tu-sistema.com/webhooks/mensajeria"
            />
            <Button variant="outline" className="shrink-0" disabled={!config.data?.url || test.isWorking} onClick={handleTest}>
              <Send className="size-4" />
              Enviar prueba
            </Button>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Déjala vacía y guarda para desactivar los webhooks de este sistema.</p>
          {save.error && <p className="mt-1.5 text-xs text-red-600">{save.error}</p>}
          {test.error && <p className="mt-1.5 text-xs text-red-600">{test.error}</p>}
          {testSent && <p className="mt-1.5 text-xs text-emerald-600">Prueba enviada. Aparecerá abajo en unos segundos.</p>}
        </div>

        <div>
          <Label>Secreto de firma</Label>
          <CopyField value={config.data?.secret ?? ''} />
          <p className="mt-1.5 text-xs text-slate-500">
            Cada aviso viaja firmado con HMAC-SHA256 en la cabecera <code className="font-mono">X-Signature</code>.
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Últimos envíos</p>
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {(events.data ?? []).length === 0 && (
              <li className="px-3.5 py-3 text-sm text-slate-400">{events.isLoading ? 'Cargando...' : 'Todavía no se envió ningún aviso.'}</li>
            )}
            {(events.data ?? []).map((event) => {
              const badge = EVENT_BADGES[event.status]
              return (
                <li key={event.id} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[13px] text-slate-800">{event.type}</p>
                    <p className="text-xs text-slate-400">
                      {formatDateTime(new Date(event.createdAt))} · {event.attempts} {event.attempts === 1 ? 'intento' : 'intentos'}
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
    </Dialog>
  )
}

export function WebhookDialog({ system, onClose, onSaved }: WebhookDialogProps) {
  if (!system?.tenantId) return null
  // Keyed by system so the form starts clean for each one.
  return <WebhookForm key={system.tenantId} tenantId={system.tenantId} onClose={onClose} onSaved={onSaved} />
}
