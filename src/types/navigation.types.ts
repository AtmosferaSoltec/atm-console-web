import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
  /** Groups that are always expanded and have no toggle (e.g. the dashboard). */
  alwaysOpen?: boolean
}

/** A block of the menu: the products ("Sistemas") or the platform ("Microservicios"). */
export interface NavSection {
  label: string
  groups: NavGroup[]
}

export interface SidebarProps {
  onNavigate?: () => void
}

export interface SidebarGroupProps {
  group: NavGroup
  open: boolean
  onToggle: () => void
  onNavigate?: () => void
}
