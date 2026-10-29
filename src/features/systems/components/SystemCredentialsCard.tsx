import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { CopyField } from '@/components/common/CopyField'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { formatDateTime } from '@/utils/format'
import { useSystemSecret } from '../hooks/useSystemSecret'
import type { IssuedSecret, SystemCredentialsCardProps } from '../types/system.types'

type Pending = 'regenerate' | 'revoke'

export function SystemCredentialsCard({ system, onChanged }: SystemCredentialsCardProps) {
  const { generate, revoke, isWorking, error } = useSystemSecret()
  const [pending, setPending] = useState<Pending | null>(null)
  const [issued, setIssued] = useState<IssuedSecret | null>(null)

  const handleGenerate = async () => {
    const result = await generate(system.id)
    if (result) {
      setIssued(result)
      onChanged()
    }
  }

  const handleConfirm = async () => {
    const action = pending
    setPending(null)
    if (action === 'regenerate') await handleGenerate()
    else if (await revoke(system.id)) onChanged()
  }

  return (
    <Card className="mb-6 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Credencial del sistema</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Con ella el backend de {system.name} pide un token a auth-api y lo usa en cualquier microservicio. Es una sola para todos.
          </p>
          {system.hasSecret && system.secretCreatedAt && (
            <p className="mt-2 text-sm text-slate-600">
              Generada el {formatDateTime(new Date(system.secretCreatedAt))}.{' '}
              {system.secretLastUsedAt ? `Último uso: ${formatDateTime(new Date(system.secretLastUsedAt))}.` : 'Todavía no se ha usado.'}
            </p>
          )}
          {!system.hasSecret && <p className="mt-2 text-sm text-slate-600">Este sistema todavía no tiene credencial.</p>}
        </div>
        <div className="flex shrink-0 gap-2">
          {system.hasSecret ? (
            <>
              <Button variant="outline" disabled={isWorking} onClick={() => setPending('regenerate')}>
                Regenerar
              </Button>
              <Button variant="danger" disabled={isWorking} onClick={() => setPending('revoke')}>
                Revocar
              </Button>
            </>
          ) : (
            <Button disabled={isWorking} onClick={handleGenerate}>
              {isWorking ? 'Generando...' : 'Generar credencial'}
            </Button>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <ConfirmDialog
        open={pending === 'regenerate'}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title="Regenerar credencial"
        description={`La credencial actual de ${system.name} deja de funcionar de inmediato. Tendrás que poner la nueva en su backend.`}
        confirmLabel="Regenerar"
        destructive
      />
      <ConfirmDialog
        open={pending === 'revoke'}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title="Revocar credencial"
        description={`${system.name} ya no podrá pedir tokens. Los que ya tiene siguen valiendo hasta que venzan (unos minutos).`}
        confirmLabel="Revocar"
        destructive
      />
      <Dialog
        open={issued !== null}
        onClose={() => setIssued(null)}
        title="Credencial generada"
        footer={<Button onClick={() => setIssued(null)}>Ya la guardé</Button>}
      >
        {issued && (
          <div className="space-y-4">
            <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <p>El secreto se muestra una sola vez. Cópialo ahora y guárdalo en el backend del sistema; después no se puede recuperar.</p>
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">Client ID</p>
              <CopyField value={issued.clientId} />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">Client secret</p>
              <CopyField value={issued.clientSecret} />
            </div>
          </div>
        )}
      </Dialog>
    </Card>
  )
}
