import { Construction } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/card'
import type { ComingSoonProps } from '@/types/ui.types'

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card className="flex flex-col items-center px-6 py-20 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Construction className="size-6" />
        </span>
        <p className="mt-4 text-sm font-medium text-slate-700">Esta sección se migrará pronto</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">Primero estamos maquetando el inicio de sesión y el resumen.</p>
      </Card>
    </>
  )
}
