import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { BrandMark } from '@/components/common/BrandMark'
import { Sidebar } from '@/components/common/Sidebar'

export function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
        <BrandMark />
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen(true)}
          className="cursor-pointer rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={() => setMenuOpen(false)} />
          <div className="relative h-full w-64 animate-fade-in">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 -right-12 cursor-pointer rounded-lg bg-white p-2 text-slate-600 shadow"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
