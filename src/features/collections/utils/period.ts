import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

/** '2026-10' -> 'Octubre 2026'; a yearly period such as '2026' stays as it is. */
export function formatPeriod(period: string): string {
  if (!/^\d{4}-\d{2}$/.test(period)) return period
  const label = format(parseISO(`${period}-01`), 'LLLL yyyy', { locale: es })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** Formats an ISO date (yyyy-mm-dd), or '—' when there is none. */
export function formatIsoDate(iso: string | null): string {
  return iso ? format(parseISO(iso), 'd MMM yyyy', { locale: es }) : '—'
}

/** 'RUC 20512345678', or nothing when the client has no RUC. */
export function formatRuc(ruc: string | null): string | null {
  return ruc ? `RUC ${ruc}` : null
}
