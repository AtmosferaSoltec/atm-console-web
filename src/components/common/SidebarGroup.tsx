import { ChevronDown } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { SidebarGroupProps } from '@/types/navigation.types'
import { cn } from '@/utils/cn'

export function SidebarGroup({ group, open, onToggle, onNavigate }: SidebarGroupProps) {
  return (
    <div>
      {group.alwaysOpen ? (
        <p className="mb-1 px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{group.label}</p>
      ) : (
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className="mb-1 flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase transition hover:text-slate-300"
        >
          {group.label}
          <ChevronDown className={cn('size-3.5 transition-transform', !open && '-rotate-90')} />
        </button>
      )}

      <div className={cn('grid transition-[grid-template-rows] duration-200', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0.5">
            {group.items.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                tabIndex={open ? 0 : -1}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('size-[18px]', isActive && 'text-brand-400')} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
