import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { STATUS_FILTER_OPTIONS } from '@/config/options'
import type { ListToolbarProps } from '@/types/ui.types'

export function ListToolbar({ search, onSearchChange, searchPlaceholder, status, onStatusChange, children }: ListToolbarProps) {
  return (
    <div className="flex flex-col gap-2 p-4 sm:flex-row">
      <div className="sm:max-w-xs sm:flex-1">
        <Input leadingIcon={Search} placeholder={searchPlaceholder} value={search} onChange={(event) => onSearchChange(event.target.value)} />
      </div>
      {status !== undefined && onStatusChange && (
        <Select value={status} onValueChange={onStatusChange} options={STATUS_FILTER_OPTIONS} aria-label="Estado" className="sm:w-48" />
      )}
      {children}
    </div>
  )
}
