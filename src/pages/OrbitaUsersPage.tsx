import { UserCheck, UserX, Users } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { OrbitaPeopleList, useOrbitaPeople } from '@/features/orbita'

export function OrbitaUsersPage() {
  const { people, summary, isLoading, error, reload } = useOrbitaPeople()
  const ready = !isLoading && error === null
  const count = (value: number) => (ready ? String(value) : '—')

  return (
    <>
      <PageHeader title="Usuarios de Orbita" description="Las personas que se registraron en Orbita." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Personas" value={count(summary.total)} hint="Con acceso a Orbita" icon={Users} />
        <StatCard label="Activas" value={count(summary.active)} hint="Pueden ingresar" icon={UserCheck} tone="sky" />
        <StatCard label="Desactivadas" value={count(summary.disabled)} hint="Sin acceso a ningún sistema" icon={UserX} tone="amber" />
      </div>
      <OrbitaPeopleList people={people} isLoading={isLoading} error={error} onChanged={reload} />
    </>
  )
}
