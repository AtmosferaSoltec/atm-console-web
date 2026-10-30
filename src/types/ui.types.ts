import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, TdHTMLAttributes, TextareaHTMLAttributes, ThHTMLAttributes } from 'react'
import type { DateRange } from 'react-day-picker'
import type { EntityStatus } from '@/types/common.types'

export type ButtonVariant = 'primary' | 'dark' | 'outline' | 'ghost' | 'danger' | 'danger-ghost'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: LucideIcon
  invalid?: boolean
}

export type PasswordInputProps = Omit<InputProps, 'type' | 'leadingIcon'>

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'violet'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  dot?: boolean
}

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>
export type TableHeadCellProps = ThHTMLAttributes<HTMLTableCellElement>

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  id?: string
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  leadingIcon?: LucideIcon
  className?: string
  disabled?: boolean
  'aria-label'?: string
}

export interface DatePickerProps {
  value?: Date
  onChange: (value: Date | undefined) => void
  placeholder?: string
  className?: string
}

export interface DateRangePreset {
  label: string
  getRange: () => DateRange
}

export interface DateRangePickerProps {
  value?: DateRange
  onChange: (value: DateRange | undefined) => void
  presets?: DateRangePreset[]
  placeholder?: string
  className?: string
}

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
}

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

export type BrandMarkTone = 'light' | 'dark'

export interface BrandMarkProps {
  tone?: BrandMarkTone
  className?: string
}

export interface PageHeaderProps {
  title: string
  description?: ReactNode
  actions?: ReactNode
}

export type StatTone = 'brand' | 'sky' | 'amber' | 'red' | 'violet'

export interface StatCardProps {
  label: string
  value: string
  hint: string
  icon: LucideIcon
  tone?: StatTone
}

export interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}

export interface ComingSoonProps {
  title: string
  description?: string
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
}

export interface StatusBadgeProps {
  status: EntityStatus
}

export interface TableFooterProps {
  shown: number
  total: number
  noun: string
}

export interface BackLinkProps {
  to: string
  label: string
}

export interface ListToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  /** The status filter is shown only when both `status` and `onStatusChange` are given. */
  status?: string
  onStatusChange?: (value: string) => void
  /** Extra filters, shown after the status filter. */
  children?: ReactNode
}

export interface EmptyRowProps {
  colSpan: number
  message: string
}

export interface NotFoundCardProps {
  message: string
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export interface CopyFieldProps {
  value: string
  mono?: boolean
}

export interface DetailItem {
  label: string
  value: ReactNode
}

export interface DetailListProps {
  items: DetailItem[]
}

export interface ExternalLinkProps {
  href: string | null
  children: ReactNode
}

export interface ProgressBarProps {
  value: number
  max: number
}

export interface PaginationFooterProps {
  summary: string
  hasPrevious: boolean
  hasNext: boolean
  onPrevious: () => void
  onNext: () => void
}

export interface FilterChipOption {
  value: string
  label: string
  count: number
}

export interface FilterChipsProps {
  options: FilterChipOption[]
  value: string
  onChange: (value: string) => void
}

export interface FilterFieldProps {
  label: string
  htmlFor: string
  children: ReactNode
}
