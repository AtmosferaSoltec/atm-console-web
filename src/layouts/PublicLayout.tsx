import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'
import logo from '@/assets/brand/logo-full-dark.svg'
import { cn } from '@/utils/cn'

interface PublicLayoutProps {
  children: ReactNode
  /** Line under the card. Defaults to the one of the WhatsApp page. */
  footer?: string
  /** A wider card, for pages with tables. */
  wide?: boolean
}

/** Frame of the pages a customer opens from a link, with no session and no console menu. */
export function PublicLayout({ children, footer = 'Conexión segura · Tus mensajes no se almacenan en esta página', wide = false }: PublicLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-50 via-white to-slate-50">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />

      <div className={cn('relative mx-auto flex min-h-screen flex-col px-5 py-8', wide ? 'max-w-4xl' : 'max-w-xl')}>
        <header className="flex justify-center">
          <img src={logo} alt="Atmosfera" className="h-6 w-auto" />
        </header>

        <main className="flex flex-1 items-center py-8">
          <div className="w-full animate-fade-in rounded-3xl border border-white bg-white/80 px-6 py-10 shadow-pop backdrop-blur sm:px-10">
            {children}
          </div>
        </main>

        <footer className="flex items-center justify-center gap-1.5 pb-16 text-xs text-slate-400">
          <Lock className="size-3.5" />
          {footer}
        </footer>
      </div>
    </div>
  )
}
