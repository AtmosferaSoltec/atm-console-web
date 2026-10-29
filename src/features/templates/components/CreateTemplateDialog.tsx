import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useSystems } from '@/features/systems'
import type { CreateTemplateDialogProps } from '../types/template.types'

export function CreateTemplateDialog({ open, onClose }: CreateTemplateDialogProps) {
  const { systems } = useSystems()
  const [systemId, setSystemId] = useState('')
  const [format, setFormat] = useState('pdf')

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nueva plantilla"
      description="Define el diseño una vez; los sistemas solo envían los datos para generar cada documento."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>Crear plantilla</Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Nombre" htmlFor="template-name">
          <Input id="template-name" placeholder="Cotización" />
        </FormField>
        <FormField label="Sistema" htmlFor="template-system">
          <Select id="template-system" value={systemId} onValueChange={setSystemId} placeholder="Elige un sistema" options={systems.map((system) => ({ value: system.id, label: system.name }))} />
        </FormField>
        <FormField label="Formato" htmlFor="template-format">
          <Select
            id="template-format"
            value={format}
            onValueChange={setFormat}
            options={[
              { value: 'pdf', label: 'PDF' },
              { value: 'email', label: 'Correo' },
            ]}
          />
        </FormField>
      </div>
    </Dialog>
  )
}
