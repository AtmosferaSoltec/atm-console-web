import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { CopyField } from '@/components/common/CopyField'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { IdentityDialogProps } from '../types/identity.types'

export function CreateClientSystemDialog({ open, onClose }: IdentityDialogProps) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [created, setCreated] = useState(false)

  const close = () => {
    setCreated(false)
    setCode('')
    setName('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title={created ? 'Clave creada' : 'Nuevo sistema con acceso'}
      description={created ? undefined : 'Cada sistema recibe su propia clave, así puedes ver quién consulta y revocar una sin afectar a las demás.'}
      footer={
        created ? (
          <Button onClick={close}>Listo, ya la guardé</Button>
        ) : (
          <>
            <Button variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={() => setCreated(true)}>Crear clave</Button>
          </>
        )
      }
    >
      {created ? (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 p-3.5 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            Copia la clave ahora: se guarda cifrada y no se puede recuperar.
          </div>
          <CopyField value="atm_id_Wq41TzK8mXc2LrB7yHn0VsJa9UdFe3Pg" />
        </div>
      ) : (
        <div className="space-y-4">
          <FormField label="Nombre" htmlFor="client-system-name">
            <Input id="client-system-name" placeholder="Ingresa el nombre" value={name} onChange={(event) => setName(event.target.value)} />
          </FormField>
          <FormField label="Código" htmlFor="client-system-code" hint="Minúsculas, números, guiones. Debe empezar con una letra y ser único.">
            <Input
              id="client-system-code"
              placeholder="Ingresa el código"
              className="font-mono"
              value={code}
              onChange={(event) => setCode(event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
            />
          </FormField>
        </div>
      )}
    </Dialog>
  )
}
