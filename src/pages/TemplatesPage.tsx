import { FileText, LayoutTemplate, Workflow } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card } from '@/components/ui/card'
import { useSystems } from '@/features/systems'
import { ServiceCard, TemplatePreviewDialog, TemplatesTable, useCatalog } from '@/features/templates'
import type { DocumentTemplate } from '@/features/templates'

export function TemplatesPage() {
  const { catalog, isLoading, error } = useCatalog()
  const { systems } = useSystems()
  const [previewing, setPreviewing] = useState<DocumentTemplate | null>(null)

  const templates = catalog?.templates ?? []
  const formatsCount = new Set(templates.flatMap((template) => template.formats.map((format) => format.code))).size
  const systemNames = Object.fromEntries(systems.map((system) => [system.code, system.name]))
  const emptyMessage = isLoading ? 'Cargando plantillas...' : (error ?? 'El servicio no tiene plantillas.')

  return (
    <>
      <PageHeader
        title="Plantillas"
        description="Los diseños viven en el código del servicio de documentos. Aquí ves cuáles hay, cómo se ven con datos de ejemplo y qué sistemas pueden usarlos."
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Plantillas" value={catalog ? String(templates.length) : '—'} hint="Documentos que el servicio sabe generar" icon={FileText} />
        <StatCard label="Formatos de papel" value={catalog ? String(formatsCount) : '—'} hint="A4 y ticket térmico" icon={LayoutTemplate} tone="sky" />
        <StatCard label="Sistemas autorizados" value={catalog ? String(catalog.service.allowedSystems.length) : '—'} hint="Pueden pedir documentos" icon={Workflow} tone="violet" />
      </div>
      <Card className="mb-4">
        <TemplatesTable templates={templates} emptyMessage={emptyMessage} onPreview={setPreviewing} />
      </Card>
      {catalog && <ServiceCard service={catalog.service} limits={templates[0]?.limits ?? null} systemNames={systemNames} />}
      <TemplatePreviewDialog template={previewing} onClose={() => setPreviewing(null)} />
    </>
  )
}
