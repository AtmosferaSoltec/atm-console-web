import { BarChart3, ChevronDown, CreditCard, DoorOpen, LayoutDashboard, Settings, ShoppingBag, ShoppingCart, Tablet, Users } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/cn'
import type { GymPreviewProps, PreviewLink, TeamRole } from '../types/pulsoSetup.types'
import { companyHasModule } from '../services/moduleCatalog'

/** Mirrors the sidebar of atm-pulso-web (src/config/pages.ts). */
const MAIN_LINKS: PreviewLink[] = [
  { label: 'Resumen', icon: LayoutDashboard, adminOnly: true },
  { label: 'Miembros', icon: Users },
  { label: 'Control de acceso', icon: DoorOpen },
  { label: 'Pagos e ingresos', icon: CreditCard },
  { label: 'Vender', icon: ShoppingCart, module: 'sales' },
  { label: 'Ventas', icon: ShoppingBag, module: 'sales' },
]

const SETTINGS_LINKS: PreviewLink[] = [
  { label: 'Usuarios', icon: Users, adminOnly: true },
  { label: 'Planes y tarifas', icon: BarChart3, adminOnly: true },
  { label: 'Productos', icon: ShoppingBag, module: 'sales', adminOnly: true },
  { label: 'Quiosco', icon: Tablet, module: 'kiosk' },
]

/** A small, faithful picture of what the company's staff sees in Pulso with the current modules and branches. */
export function GymPreview({ company, modules }: GymPreviewProps) {
  const [role, setRole] = useState<TeamRole>('admin')
  const visible = (link: PreviewLink) => (!link.module || companyHasModule(modules, company, link.module)) && (!link.adminOnly || role === 'admin')
  const main = MAIN_LINKS.filter(visible)
  const settings = SETTINGS_LINKS.filter(visible)
  const manyBranches = company.branches.length > 1
  const hidden = [...MAIN_LINKS, ...SETTINGS_LINKS].filter((link) => link.module && !companyHasModule(modules, company, link.module))

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">Así se ve Pulso para el personal de {company.tradeName}. Cambia módulos o sedes y vuelve aquí.</p>
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-sm" role="radiogroup" aria-label="Ver como">
          {(['admin', 'receptionist'] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={role === item}
              onClick={() => setRole(item)}
              className={cn('cursor-pointer rounded-md px-3 py-1 font-medium transition', role === item ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500')}
            >
              {item === 'admin' ? 'Administrador' : 'Recepción'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-card">
        <div className="flex items-center gap-1.5 border-b border-slate-200 bg-white px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-slate-200" />
          <span className="size-2.5 rounded-full bg-slate-200" />
          <span className="size-2.5 rounded-full bg-slate-200" />
          <span className="ml-3 truncate rounded-md bg-slate-100 px-3 py-0.5 text-xs text-slate-500">pulso.atmosferast.com</span>
        </div>
        <div className="grid min-h-[420px] md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-3 border-b border-slate-200 bg-white p-3 md:border-r md:border-b-0">
            <div className="flex items-center gap-2.5 px-1">
              <span className="flex size-9 items-center justify-center rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: company.brandColor }}>
                {company.tradeName.slice(0, 1).toUpperCase()}
              </span>
              <span className="truncate text-sm font-semibold text-slate-900">{company.tradeName}</span>
            </div>
            {manyBranches && (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <span className="min-w-0">
                  <span className="block text-[11px] text-slate-400">Sede</span>
                  <span className="block truncate font-medium text-slate-800">{company.branches[0].name}</span>
                </span>
                <ChevronDown className="size-4 text-slate-400" />
              </div>
            )}
            <nav className="flex flex-col gap-0.5">
              {main.map((link, index) => {
                const Icon = link.icon
                return (
                  <span
                    key={link.label}
                    className={cn('flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm', index === 0 ? 'font-medium' : 'text-slate-600')}
                    style={index === 0 ? { backgroundColor: `${company.brandColor}14`, color: company.brandColor } : undefined}
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </span>
                )
              })}
              {settings.length > 0 && (
                <>
                  <span className="mt-2 flex items-center gap-2.5 px-2.5 py-1.5 text-sm text-slate-600">
                    <Settings className="size-4" />
                    Configuración
                  </span>
                  {settings.map((link) => (
                    <span key={link.label} className="ml-6 rounded-lg px-2.5 py-1 text-xs text-slate-500">
                      {link.label}
                    </span>
                  ))}
                </>
              )}
            </nav>
          </aside>
          <div className="space-y-4 p-5">
            <div>
              <p className="text-xs text-slate-500">{manyBranches ? `${company.branches[0].name} · ${company.branches.length} sedes` : 'Hoy'}</p>
              <p className="text-lg font-semibold text-slate-900">{role === 'admin' ? 'Resumen del gimnasio' : 'Control de acceso'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {['Ingresos hoy', 'Cobrado hoy', 'Socios activos', ...(companyHasModule(modules, company, 'sales') ? ['Ventas de productos'] : [])].map((label) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <div className="mt-2 h-5 w-16 rounded bg-slate-100" />
                </div>
              ))}
            </div>
            <div className="h-28 rounded-xl border border-dashed border-slate-300 bg-white/60" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-medium text-slate-900">Sedes</p>
          <p className="mt-1 text-slate-500">
            {manyBranches ? `${company.branches.length} sedes: aparece el selector de sede arriba del menú.` : 'Una sede: no hay selector, ni columnas ni filtros de sede.'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-medium text-slate-900">Ocultos por módulos apagados</p>
          <p className="mt-1 text-slate-500">{hidden.length ? hidden.map((link) => link.label).join(', ') : 'Nada: tiene todos los módulos.'}</p>
        </div>
      </div>
    </div>
  )
}
