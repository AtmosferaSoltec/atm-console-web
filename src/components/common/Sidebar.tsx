import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BrandMark } from '@/components/common/BrandMark'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { SidebarGroup } from '@/components/common/SidebarGroup'
import { NAV_SECTIONS } from '@/config/navigation'
import { useLogout } from '@/features/auth'
import type { NavGroup, SidebarProps } from '@/types/navigation.types'

export function Sidebar({ onNavigate }: SidebarProps) {
  const logout = useLogout()
  const { pathname } = useLocation()
  const [confirmingLogout, setConfirmingLogout] = useState(false)
  // Only the groups the user toggled by hand. The rest follow the current page.
  const [toggled, setToggled] = useState<Record<string, boolean>>({})

  const isOpen = (group: NavGroup) => toggled[group.label] ?? group.items.some((item) => pathname.startsWith(item.to))

  return (
    <div className="flex h-full flex-col bg-ink px-4 py-5">
      <BrandMark tone="light" className="px-2" />

      <nav className="scrollbar-thin mt-6 -mr-2 flex-1 space-y-5 overflow-y-auto pr-2">
        {NAV_SECTIONS.map((section) => (
          <section key={section.label} aria-label={section.label} className="space-y-3">
            <h2 className="px-3 text-[10px] font-bold tracking-[0.18em] text-slate-600 uppercase">{section.label}</h2>
            {section.groups.map((group) => (
              <SidebarGroup
                key={group.label}
                group={group}
                open={group.alwaysOpen || isOpen(group)}
                onToggle={() => setToggled((current) => ({ ...current, [group.label]: !isOpen(group) }))}
                onNavigate={onNavigate}
              />
            ))}
          </section>
        ))}
      </nav>

      <div className="mt-4 flex items-center gap-3 rounded-lg border-t border-white/10 px-2 pt-4">
        <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-lime-brand to-brand-500 text-sm font-semibold text-ink">
          A
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium text-white">Superadmin</p>
          <p className="truncate text-xs text-slate-500">Propietario de Atmosfera</p>
        </div>
        <button
          type="button"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          onClick={() => setConfirmingLogout(true)}
          className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4" />
        </button>
      </div>

      <ConfirmDialog
        open={confirmingLogout}
        onClose={() => setConfirmingLogout(false)}
        onConfirm={logout}
        title="Cerrar sesión"
        description="Volverás a la pantalla de inicio de sesión."
        confirmLabel="Cerrar sesión"
      />
    </div>
  )
}
