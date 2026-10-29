import { Layers, ShieldCheck, Zap } from 'lucide-react'
import { BrandMark } from '@/components/common/BrandMark'
import type { AuthLayoutProps } from '@/types/layout.types'

const HIGHLIGHTS = [
  { icon: Layers, text: 'Mensajería, facturación y plataforma en un solo panel' },
  { icon: Zap, text: 'Estado de cada servicio de Atmosfera en tiempo real' },
  { icon: ShieldCheck, text: 'Acceso exclusivo para administradores de Atmosfera' },
]

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -top-32 -left-24 size-[28rem] rounded-full bg-brand-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 size-[26rem] rounded-full bg-lime-brand/15 blur-3xl" />

        <BrandMark tone="light" className="relative" />

        <div className="relative mt-auto max-w-md">
          <h2 className="text-4xl leading-tight font-semibold tracking-tight">
            Todo Atmosfera, <span className="bg-gradient-to-r from-lime-brand to-brand-500 bg-clip-text text-transparent">en una sola consola.</span>
          </h2>
          <p className="mt-4 text-base text-slate-300">Administra los servicios y APIs de la plataforma desde un único lugar, sin saltar entre paneles.</p>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3.5 text-sm text-slate-200">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-300">
                  <Icon className="size-[18px]" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <BrandMark className="mb-10 lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  )
}
