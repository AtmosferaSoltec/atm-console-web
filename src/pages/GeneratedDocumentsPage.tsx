import { CircleCheck, TriangleAlert } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card } from '@/components/ui/card'
import { GeneratedTable, useGeneratedDocuments } from '@/features/templates'

export function GeneratedDocumentsPage() {
  const documents = useGeneratedDocuments()

  return (
    <>
      <PageHeader title="Documentos generados" description="Lo último que generaron los sistemas a partir de las plantillas." />
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <StatCard label="Generados (24 h)" value="1,042" hint="98% sin errores" icon={CircleCheck} />
        <StatCard label="Con error" value="3" hint="Revisa los datos que envió el sistema" icon={TriangleAlert} tone="amber" />
      </div>
      <Card>
        <GeneratedTable documents={documents} />
      </Card>
    </>
  )
}
