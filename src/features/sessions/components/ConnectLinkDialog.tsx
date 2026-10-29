import { Clock, RefreshCw, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { CopyField } from '@/components/common/CopyField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ConnectLinkDialogProps } from '../types/session.types'

export function ConnectLinkDialog({ session, onClose }: ConnectLinkDialogProps) {
  const [generated, setGenerated] = useState(false)

  const close = () => {
    setGenerated(false)
    onClose()
  }

  return (
    <Dialog
      open={session !== null}
      onClose={close}
      size="lg"
      title="Link para vincular WhatsApp"
      description={session ? `Envíaselo al dueño de ${session.accountRef}. Al abrirlo verá el QR para escanear con su celular.` : undefined}
      footer={
        <>
          {generated && (
            <Button variant="outline">
              <RefreshCw className="size-4" />
              Regenerar link
            </Button>
          )}
          <Button variant={generated ? 'primary' : 'outline'} onClick={close}>
            {generated ? 'Listo' : 'Cerrar'}
          </Button>
        </>
      }
    >
      {session && (
        <div className="space-y-5">
          {session.status === 'connected' && (
            <p className="rounded-lg bg-sky-50 p-3.5 text-sm text-sky-800">Esta conexión ya está vinculada. Si quieres vincular otro número, primero usa "Desvincular número".</p>
          )}
          <div>
            <Label htmlFor="link-label">Nombre que verá tu cliente</Label>
            <Input id="link-label" defaultValue={session.accountRef} maxLength={100} />
          </div>
          {generated ? (
            <div>
              <Label>Link</Label>
              <CopyField value="https://messaging.atmosferast.com/connect/cl_9x4Kq2LmT7vB" />
            </div>
          ) : (
            <Button onClick={() => setGenerated(true)} className="w-full">
              Generar link
            </Button>
          )}
          <ul className="space-y-2.5 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-slate-400" />
              {generated ? 'Vence en 23 h 59 min. ' : 'Vence a las 24 horas. '}Si generas otro link, el anterior deja de funcionar.
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-400" />
              Solo sirve para ver el QR de esta conexión: no da acceso a nada más. Trátalo como un secreto.
            </li>
          </ul>
        </div>
      )}
    </Dialog>
  )
}
