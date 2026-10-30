import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const numberFormatter = new Intl.NumberFormat('es-PE')

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatDate(date: Date): string {
  return format(date, 'd MMM yyyy', { locale: es })
}

export function formatDateTime(date: Date): string {
  return format(date, 'd MMM yyyy, HH:mm', { locale: es })
}

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

/** 1536 -> '1,5 KB'. */
export function formatBytes(bytes: number): string {
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024
    unit += 1
  }
  const digits = unit === 0 || value >= 100 ? 0 : 1
  return `${value.toLocaleString('es-PE', { maximumFractionDigits: digits })} ${BYTE_UNITS[unit]}`
}

/** '51936416623' -> '+51 936 416 623'. */
export function formatPhone(digits: string): string {
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})$/, '+$1 $2 $3 $4')
}

export function formatMoney(amount: number, currency: 'PEN' | 'USD'): string {
  const symbol = currency === 'PEN' ? 'S/' : 'US$'
  return `${symbol} ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDocumentNumber(series: string, number: number): string {
  return `${series}-${String(number).padStart(6, '0')}`
}

const MINUTE_MS = 60_000
const HOUR_MINUTES = 60

/** Time left until `iso`, e.g. '3 h 20 min' or '45 min'. */
export function formatRemaining(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.parse(iso) - Date.now()) / MINUTE_MS))
  const hours = Math.floor(minutes / HOUR_MINUTES)
  const rest = minutes % HOUR_MINUTES
  return hours > 0 ? `${hours} h ${rest} min` : `${rest} min`
}
