import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePreviewUrl } from '../hooks/useTemplates'
import type { DocumentTemplate, TemplatePreviewDialogProps } from '../types/template.types'

function PreviewFrame({ template, format }: { template: DocumentTemplate; format: string }) {
  const { url, error } = usePreviewUrl(template.code, format)
  if (error) {
    return (
      <p role="alert" className="py-10 text-center text-sm text-red-600">
        No se pudo generar la vista previa.
      </p>
    )
  }
  if (!url) return <p className="py-10 text-center text-sm text-slate-500">Generando vista previa...</p>
  return (
    <>
      <iframe src={`${url}#navpanes=0&view=FitH`} title={`Ejemplo de ${template.name}`} className="h-[60vh] w-full rounded-lg border border-slate-200 bg-slate-50" />
      <a href={url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
        Abrir en otra pestaña
        <ExternalLink className="size-3.5" />
      </a>
    </>
  )
}

/** The template rendered with fictional data, one tab per paper format. */
function TemplatePreview({ template }: { template: DocumentTemplate }) {
  const [format, setFormat] = useState(template.formats[0]?.code ?? '')
  return (
    <>
      <Tabs value={format} onValueChange={setFormat}>
        <TabsList className="mb-4 px-0">
          {template.formats.map((item) => (
            <TabsTrigger key={item.code} value={item.code}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {/* Keyed so each format starts a new request and drops the previous object URL. */}
      <PreviewFrame key={format} template={template} format={format} />
    </>
  )
}

export function TemplatePreviewDialog({ template, onClose }: TemplatePreviewDialogProps) {
  return (
    <Dialog open={template !== null} onClose={onClose} size="lg" title={template?.name ?? ''} description="Datos de ejemplo: no es un documento real.">
      {template && <TemplatePreview template={template} />}
    </Dialog>
  )
}
