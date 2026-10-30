const FORMAT_LABELS: Record<string, string> = { a4: 'A4', ticket: 'Ticket' }

/** 'a4' -> 'A4'. An empty code means the request was rejected before its format was known. */
export function formatLabel(code: string): string {
  if (!code || code === 'unknown') return '—'
  return FORMAT_LABELS[code] ?? code
}
