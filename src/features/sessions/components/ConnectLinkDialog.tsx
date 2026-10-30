import { Clock, RefreshCw, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { CopyField } from '@/components/common/CopyField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDateTime } from '@/utils/format'
import { useCreateConnectLink } from '../hooks/useSessionActions'
import type { ConnectLink, ConnectLinkDialogProps, Session } from '../types/session.types'

interface LinkFormProps {
  session: Session
  onClose: () => void
}

function LinkForm({ session, onClose }: LinkFormProps) {
  const createLink = useCreateConnectLink()
  const [label, setLabel] = useState(session.accountRef)
  const [link, setLink] = useState<ConnectLink | null>(null)

  const generate = async () => {
    const created = await createLink.run(session.id, label.trim())
    if (created) setLink(created)
  }

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title="Link para vincular WhatsApp"
      description={`Envíaselo al dueño de ${session.accountRef}. Al abrirlo verá el QR para escanear con su celular.`}
      footer={
        <>
          {link && (
            <Button variant="outline" onClick={generate} disabled={createLink.isWorking}>
              <RefreshCw className="size-4" />
              Regenerar link
            </Button>
          )}
          <Button variant={link ? 'primary' : 'outline'} onClick={onClose}>
            {link ? 'Listo' : 'Cerrar'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {session.status === 'connected' && (
          <p className="rounded-lg bg-sky-50 p-3.5 text-sm text-sky-800">
            Esta conexión ya está vinculada. Si quieres vincular otro número, primero usa "Desvincular número".
          </p>
        )}
        <div>
          <Label htmlFor="link-label">Nombre que verá tu cliente</Label>
          <Input id="link-label" value={label} onChange={(event) => setLabel(event.target.value)} maxLength={100} />
        </div>
        {link ? (
          <div>
            <Label>Link</Label>
            <CopyField value={link.url} />
          </div>
        ) : (
          <Button onClick={generate} className="w-full" disabled={createLink.isWorking}>
            {createLink.isWorking ? 'Generando...' : 'Generar link'}
          </Button>
        )}
        {createLink.error && <p className="text-sm text-red-600">{createLink.error}</p>}
        <ul className="space-y-2.5 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          <li className="flex items-start gap-2.5">
            <Clock className="mt-0.5 size-4 shrink-0 text-slate-400" />
            {link ? `Vence el ${formatDateTime(new Date(link.expiresAt))}. ` : 'Vence a las 24 horas. '}Si generas otro link, el anterior deja de funcionar.
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-400" />
            Solo sirve para ver el QR de esta conexión: no da acceso a nada más. Trátalo como un secreto.
          </li>
        </ul>
      </div>
    </Dialog>
  )
}

export function ConnectLinkDialog({ session, onClose }: ConnectLinkDialogProps) {
  if (!session) return null
  // Keyed by connection so a new one never shows the previous link.
  return <LinkForm key={session.id} session={session} onClose={onClose} />
}
