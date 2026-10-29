import { endOfDay, startOfDay, startOfMonth, subDays } from 'date-fns'
import { Boxes, HardDrive, MessagesSquare, Receipt, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Select } from '@/components/ui/select'
import { ActivityChart, AttentionList, RecentActivity, ServiceStatusList, useDashboard } from '@/features/dashboard'
import type { DateRangePreset, SelectOption } from '@/types/ui.types'
import { formatNumber } from '@/utils/format'

const SERVICE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todos los servicios' },
  { value: 'auth', label: 'Autenticación' },
  { value: 'messaging', label: 'Mensajería' },
  { value: 'billing', label: 'Facturación' },
  { value: 'identity', label: 'Identidad' },
  { value: 'documents', label: 'Documentos' },
  { value: 'storage', label: 'Almacenamiento' },
]

const RANGE_PRESETS: DateRangePreset[] = [
  { label: 'Hoy', getRange: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: 'Últimos 7 días', getRange: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: 'Últimos 30 días', getRange: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: 'Este mes', getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
]

export function DashboardPage() {
  const { metrics, services, activity, attention, recentMessages, recentInvoices } = useDashboard()
  const [service, setService] = useState('all')
  const [range, setRange] = useState<DateRange | undefined>(() => RANGE_PRESETS[1].getRange())

  return (
    <>
      <PageHeader
        title="Resumen"
        description="Estado general de la plataforma Atmosfera."
        actions={
          <>
            <Select value={service} onValueChange={setService} options={SERVICE_OPTIONS} leadingIcon={Boxes} aria-label="Servicio" className="w-52" />
            <DateRangePicker value={range} onChange={setRange} presets={RANGE_PRESETS} />
            <Button variant="outline">
              <RefreshCw className="size-4" />
              Actualizar
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Servicios operativos"
          value={`${metrics.servicesOnline} de ${metrics.servicesTotal}`}
          hint="Un servicio responde más lento de lo normal"
          icon={Boxes}
        />
        <StatCard
          label="Mensajes (24 h)"
          value={formatNumber(metrics.messagesLast24h)}
          hint={`${metrics.deliveredRate}% llegaron al destinatario`}
          icon={MessagesSquare}
          tone="sky"
        />
        <StatCard
          label="Comprobantes del mes"
          value={formatNumber(metrics.invoicesThisMonth)}
          hint={`${metrics.acceptedRate}% aceptados por SUNAT`}
          icon={Receipt}
          tone="amber"
        />
        <StatCard
          label="Almacenamiento"
          value={`${metrics.storageUsedGb} GB`}
          hint={`de ${metrics.storageLimitGb} GB del plan`}
          icon={HardDrive}
          tone="violet"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart activity={activity} />
        </div>
        <AttentionList items={attention} />
      </div>

      <div className="mt-4">
        <ServiceStatusList services={services} />
      </div>

      <RecentActivity messages={recentMessages} invoices={recentInvoices} />
    </>
  )
}
