import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/card'
import { MonthNavigation, UsageTable, useUsage } from '@/features/usage'
import { cn } from '@/utils/cn'

export function UsagePage() {
  const rows = useUsage()
  const [month, setMonth] = useState(() => new Date())
  const totalUsed = rows.reduce((sum, row) => sum + row.used, 0)
  const nearLimit = rows.filter((row) => row.used >= row.limit * 0.8).length

  return (
    <>
      <PageHeader
        title="Consumo"
        description="Documentos emitidos por empresa contra el límite mensual de su plan de Nubefact. No cuenta los rechazados ni los de pruebas."
        actions={<MonthNavigation month={month} onChange={setMonth} />}
      />

      <div className="mb-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <p>
          <span className="text-slate-500">Documentos en {format(month, 'MMMM yyyy', { locale: es })}: </span>
          <span className="font-semibold text-slate-900">{totalUsed}</span>
        </p>
        <p>
          <span className="text-slate-500">Empresas cerca o sobre su límite: </span>
          <span className={cn('font-semibold', nearLimit > 0 ? 'text-red-600' : 'text-slate-900')}>{nearLimit}</span>
        </p>
      </div>

      <Card>
        <UsageTable rows={rows} />
      </Card>

      <p className="mt-3 text-xs text-slate-500">
        Se cuentan las facturas, boletas y guías emitidas a través de este servicio en el mes (hora de Lima), excepto las rechazadas. Lo que una empresa emita directamente desde el panel de Nubefact no aparece
        aquí. El límite de cada empresa se cambia en su ficha.
      </p>
    </>
  )
}
