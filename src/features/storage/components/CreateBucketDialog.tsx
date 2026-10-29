import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useSystems } from '@/features/systems'
import type { StorageDialogProps } from '../types/storage.types'

export function CreateBucketDialog({ open, onClose }: StorageDialogProps) {
  const { systems } = useSystems()
  const [systemId, setSystemId] = useState('')

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nuevo bucket"
      description="Un espacio separado para los archivos de un sistema."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>Crear bucket</Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Nombre" htmlFor="bucket-name" hint="Minúsculas y guiones.">
          <Input id="bucket-name" placeholder="mi-sistema-docs" className="font-mono" />
        </FormField>
        <FormField label="Sistema" htmlFor="bucket-system">
          <Select id="bucket-system" value={systemId} onValueChange={setSystemId} placeholder="Elige un sistema" options={systems.map((system) => ({ value: system.id, label: system.name }))} />
        </FormField>
        <Checkbox label="Acceso público" description="Cualquiera con el enlace podrá ver los archivos. Úsalo solo para imágenes públicas." />
      </div>
    </Dialog>
  )
}
