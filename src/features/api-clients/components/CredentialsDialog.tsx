import { TriangleAlert } from 'lucide-react'
import { CopyField } from '@/components/common/CopyField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type { CredentialsDialogProps } from '../types/apiClient.types'

export function CredentialsDialog({ credentials, heading, onClose }: CredentialsDialogProps) {
  return (
    <Dialog
      open={credentials !== null}
      onClose={onClose}
      title={heading}
      description={credentials ? `Credenciales de ${credentials.clientName}. Entrégalas al sistema que usará la API.` : undefined}
      footer={<Button onClick={onClose}>Listo, ya las guardé</Button>}
    >
      {credentials && (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 p-3.5 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            Guarda la API key ahora: no se volverá a mostrar.
          </div>
          <div>
            <Label>API key</Label>
            <CopyField value={credentials.apiKey} />
          </div>
          <div>
            <Label>Secreto del webhook</Label>
            <CopyField value={credentials.webhookSecret} />
          </div>
        </div>
      )}
    </Dialog>
  )
}
