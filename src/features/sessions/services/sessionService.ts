import type { Session } from '../types/session.types'

const SESSIONS: Session[] = [
  { id: 'ss1', clientName: 'Olympus', accountRef: 'olympus-courier', status: 'connected', phone: '51987654321', lastConnection: 'hace 3 min' },
  { id: 'ss2', clientName: 'Olympus', accountRef: 'agro-norte', status: 'connected', phone: '51912345678', lastConnection: 'hace 12 min' },
  { id: 'ss3', clientName: 'Lavendimia', accountRef: 'lavendimia-centro', status: 'disconnected', phone: '51955120044', lastConnection: 'hace 2 h' },
  { id: 'ss4', clientName: 'Lavendimia', accountRef: 'lavendimia-sur', status: 'pending_qr', phone: null, lastConnection: null },
  { id: 'ss5', clientName: 'Pulso', accountRef: 'pulso-ventas', status: 'connected', phone: '51903778112', lastConnection: 'hace 1 min' },
  { id: 'ss6', clientName: 'Hotel Atmosfera', accountRef: 'hotel-recepcion', status: 'banned', phone: '51944210987', lastConnection: 'hace 3 días' },
]

/** Hardcoded sample data. Replace with real API calls when the console is wired up. */
export function getSessions(): Session[] {
  return SESSIONS
}
