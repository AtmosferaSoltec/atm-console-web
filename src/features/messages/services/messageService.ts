import type { MessageFiltersValue, MessageRow, MessagesPageResult } from '../types/message.types'

export const EMPTY_FILTERS: MessageFiltersValue = { clientName: 'all', status: 'all', priority: 'all', search: '' }

const MESSAGES: MessageRow[] = [
  { id: 'm1', when: 'hace 2 min', accountRef: 'olympus-courier', clientName: 'Olympus', recipient: '51987654321', kind: 'text', priority: 'transactional', status: 'delivered', error: null, attempts: 1 },
  { id: 'm2', when: 'hace 6 min', accountRef: 'pulso-ventas', clientName: 'Pulso', recipient: '51912345678', kind: 'image', priority: 'transactional', status: 'read', error: null, attempts: 1 },
  { id: 'm3', when: 'hace 9 min', accountRef: 'agro-norte', clientName: 'Olympus', recipient: '51955120044', kind: 'text', priority: 'promotional', status: 'queued', error: null, attempts: 0 },
  { id: 'm4', when: 'hace 14 min', accountRef: 'olympus-courier', clientName: 'Olympus', recipient: '51903778112', kind: 'document', priority: 'transactional', status: 'failed', error: 'recipient_not_on_channel', attempts: 3 },
  { id: 'm5', when: 'hace 21 min', accountRef: 'lavendimia-centro', clientName: 'Lavendimia', recipient: '51944210987', kind: 'text', priority: 'transactional', status: 'delivered', error: null, attempts: 1 },
  { id: 'm6', when: 'hace 28 min', accountRef: 'pulso-ventas', clientName: 'Pulso', recipient: '51966321458', kind: 'audio', priority: 'transactional', status: 'sent', error: null, attempts: 1 },
  { id: 'm7', when: 'hace 35 min', accountRef: 'olympus-courier', clientName: 'Olympus', recipient: '51987112233', kind: 'video', priority: 'promotional', status: 'sending', error: null, attempts: 1 },
  { id: 'm8', when: 'hace 41 min', accountRef: 'lavendimia-centro', clientName: 'Lavendimia', recipient: '51922334455', kind: 'text', priority: 'transactional', status: 'failed', error: 'session_not_connected', attempts: 5 },
  { id: 'm9', when: 'hace 52 min', accountRef: 'agro-norte', clientName: 'Olympus', recipient: '51933445566', kind: 'text', priority: 'transactional', status: 'read', error: null, attempts: 1 },
  { id: 'm10', when: 'hace 1 h', accountRef: 'pulso-ventas', clientName: 'Pulso', recipient: '51977889900', kind: 'document', priority: 'transactional', status: 'delivered', error: null, attempts: 1 },
  { id: 'm11', when: 'hace 1 h', accountRef: 'olympus-courier', clientName: 'Olympus', recipient: '51911223344', kind: 'text', priority: 'promotional', status: 'failed', error: 'recipient_opted_out', attempts: 1 },
  { id: 'm12', when: 'hace 2 h', accountRef: 'lavendimia-centro', clientName: 'Lavendimia', recipient: '51999887766', kind: 'image', priority: 'transactional', status: 'delivered', error: null, attempts: 1 },
]

/** Hardcoded sample data. Replace with real API calls when the console is wired up. */
export function getMessages(filters: MessageFiltersValue, page: number, pageSize: number): MessagesPageResult {
  const term = filters.search.replace(/\D/g, '')
  const matching = MESSAGES.filter(
    (message) =>
      (filters.clientName === 'all' || message.clientName === filters.clientName) &&
      (filters.status === 'all' || message.status === filters.status) &&
      (filters.priority === 'all' || message.priority === filters.priority) &&
      (term === '' || message.recipient.includes(term)),
  )
  const start = page * pageSize
  return { rows: matching.slice(start, start + pageSize), total: matching.length, hasMore: start + pageSize < matching.length }
}
