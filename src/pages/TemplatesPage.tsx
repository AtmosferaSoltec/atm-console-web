import { FileText, Mail, Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CreateTemplateDialog, TemplatesTable, useTemplates } from '@/features/templates'

export function TemplatesPage() {
  const templates = useTemplates()
  const [creating, setCreating] = useState(false)

  return (
    <>
      <PageHeader
        title="Plantillas"
        description="Defines el diseño una vez; los sistemas solo envían los datos para generar cada documento."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nueva plantilla
          </Button>
        }
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <StatCard label="Plantillas de PDF" value={String(templates.filter((template) => template.format === 'pdf').length)} hint="Documentos para imprimir o enviar" icon={FileText} />
        <StatCard label="Plantillas de correo" value={String(templates.filter((template) => template.format === 'email').length)} hint="Mensajes automáticos" icon={Mail} tone="sky" />
      </div>
      <Card>
        <TemplatesTable templates={templates} />
      </Card>
      <CreateTemplateDialog open={creating} onClose={() => setCreating(false)} />
    </>
  )
}
