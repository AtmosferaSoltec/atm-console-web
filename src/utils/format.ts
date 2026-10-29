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
