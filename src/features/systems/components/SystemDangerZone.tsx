import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { SystemDangerZoneProps } from '../types/system.types'
import { DeleteSystemDialog } from './DeleteSystemDialog'

export function SystemDangerZone({ system, onDeleted }: SystemDangerZoneProps) {
  const [deleting, setDeleting] = useState(false)

  return (
    <Card className="flex flex-col gap-3 border-red-200 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Eliminar sistema</h2>
        <p className="mt-0.5 text-sm text-slate-500">Borra el sistema y todo lo que depende de él. Pide confirmar con el código.</p>
      </div>
      <Button variant="danger" onClick={() => setDeleting(true)}>
        Eliminar sistema
      </Button>
      <DeleteSystemDialog system={system} open={deleting} onClose={() => setDeleting(false)} onDeleted={onDeleted} />
    </Card>
  )
}
