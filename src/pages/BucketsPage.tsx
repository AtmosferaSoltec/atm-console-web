import { Boxes, Files, HardDrive, Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { BucketsTable, CreateBucketDialog, useBuckets, useStorageSummary } from '@/features/storage'
import { formatNumber } from '@/utils/format'

export function BucketsPage() {
  const summary = useStorageSummary()
  const buckets = useBuckets()
  const [creating, setCreating] = useState(false)

  return (
    <>
      <PageHeader
        title="Buckets"
        description="Espacios separados para los archivos de cada sistema."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nuevo bucket
          </Button>
        }
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-slate-500">Espacio usado</p>
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <HardDrive className="size-[18px]" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {summary.usedGb} <span className="text-lg font-medium text-slate-400">de {summary.limitGb} GB</span>
          </p>
          <div className="mt-3">
            <ProgressBar value={summary.usedGb} max={summary.limitGb} />
          </div>
        </Card>
        <StatCard label="Archivos" value={formatNumber(summary.filesCount)} hint="En todos los buckets" icon={Files} tone="sky" />
        <StatCard label="Buckets" value={String(summary.bucketsCount)} hint="Uno o más por sistema" icon={Boxes} tone="violet" />
      </div>
      <Card>
        <BucketsTable buckets={buckets} />
      </Card>
      <CreateBucketDialog open={creating} onClose={() => setCreating(false)} />
    </>
  )
}
