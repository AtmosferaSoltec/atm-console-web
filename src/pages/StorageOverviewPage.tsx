import { Building2, Files, HardDrive } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card } from '@/components/ui/card'
import { UsageTable, useStorageNames, useStorageSummary } from '@/features/storage'
import { formatBytes, formatNumber } from '@/utils/format'

export function StorageOverviewPage() {
  const { summary, isLoading, error } = useStorageSummary()
  const { systemNames } = useStorageNames()
  const usage = summary?.usage ?? []
  const systemsInUse = usage.filter((item) => item.scope === 'system').length
  const emptyMessage = isLoading ? 'Cargando uso...' : (error ?? 'Todavía no hay archivos guardados.')

  return (
    <>
      <PageHeader title="Almacenamiento" description="Cuánto guarda cada sistema. Todos comparten un mismo bucket privado; los sistemas se separan por ruta." />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Espacio usado" value={summary ? formatBytes(summary.totalBytes) : '—'} hint="En todos los sistemas" icon={HardDrive} />
        <StatCard label="Archivos" value={summary ? formatNumber(summary.filesCount) : '—'} hint="Listos para descargar" icon={Files} tone="sky" />
        <StatCard label="Sistemas con archivos" value={summary ? String(systemsInUse) : '—'} hint="Sin contar logos de empresas" icon={Building2} tone="violet" />
      </div>
      <Card>
        <UsageTable usage={usage} totalBytes={summary?.totalBytes ?? 0} systemNames={systemNames} emptyMessage={emptyMessage} />
      </Card>
    </>
  )
}
