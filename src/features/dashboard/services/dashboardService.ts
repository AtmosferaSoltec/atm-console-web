import { FolderOpen, HardDrive, KeyRound, MessagesSquare, Receipt, UserRoundCog } from 'lucide-react'
import type { DashboardData, HourlyActivity } from '../types/dashboard.types'

const HOURLY_MESSAGES = [12, 8, 5, 4, 6, 14, 38, 72, 96, 110, 104, 98, 88, 92, 101, 118, 124, 97, 76, 58, 44, 31, 22, 15]
const HOURLY_DOCUMENTS = [1, 0, 0, 0, 0, 2, 6, 14, 22, 31, 36, 29, 24, 27, 33, 38, 41, 30, 19, 11, 7, 4, 2, 1]

const ACTIVITY: HourlyActivity[] = HOURLY_MESSAGES.map((messages, hour) => ({
  hour,
  messages,
  documents: HOURLY_DOCUMENTS[hour],
}))

/** Hardcoded sample data. Replace with real API calls when the console is wired up. */
export function getDashboardData(): DashboardData {
  return {
    metrics: {
      servicesOnline: 5,
      servicesTotal: 6,
      messagesLast24h: 1284,
      deliveredRate: 97,
      invoicesThisMonth: 842,
      acceptedRate: 99,
      storageUsedGb: 64.2,
      storageLimitGb: 100,
    },
    services: [
      { id: 'auth', name: 'Autenticación', description: 'Inicio de sesión y tokens', icon: KeyRound, health: 'operational', latencyMs: 42, uptimePercent: 99.99 },
      { id: 'identity', name: 'Identidad', description: 'Usuarios, roles y organizaciones', icon: UserRoundCog, health: 'operational', latencyMs: 58, uptimePercent: 99.97 },
      { id: 'messaging', name: 'Mensajería', description: 'WhatsApp y webhooks', icon: MessagesSquare, health: 'degraded', latencyMs: 412, uptimePercent: 99.62 },
      { id: 'nubefact', name: 'Facturación', description: 'Comprobantes y guías (Nubefact)', icon: Receipt, health: 'operational', latencyMs: 130, uptimePercent: 99.9 },
      { id: 'documents', name: 'Documentos', description: 'Plantillas y generación de PDF', icon: FolderOpen, health: 'operational', latencyMs: 76, uptimePercent: 99.95 },
      { id: 'storage', name: 'Almacenamiento', description: 'Archivos y buckets', icon: HardDrive, health: 'operational', latencyMs: 35, uptimePercent: 100 },
    ],
    activity: ACTIVITY,
    attention: [
      { id: 'a1', severity: 'danger', title: 'Conexión desvinculada', detail: 'WhatsApp de “Lavendimia” necesita escanear el QR', source: 'Mensajería' },
      { id: 'a2', severity: 'warning', title: '3 comprobantes requieren revisión', detail: 'SUNAT no confirmó la respuesta', source: 'Facturación' },
      { id: 'a3', severity: 'warning', title: 'Webhooks fallidos', detail: '5 avisos sin entregar a “Olympus Courier”', source: 'Mensajería' },
      { id: 'a4', severity: 'warning', title: 'Almacenamiento al 64 %', detail: 'Se acerca al límite del plan de 100 GB', source: 'Almacenamiento' },
    ],
    recentMessages: [
      { id: 'm1', recipient: '+51 987 654 321', system: 'Olympus Courier', kind: 'Texto', status: 'Entregado', statusTone: 'success', time: 'hace 2 min' },
      { id: 'm2', recipient: '+51 912 345 678', system: 'Lavendimia', kind: 'Imagen', status: 'Leído', statusTone: 'info', time: 'hace 6 min' },
      { id: 'm3', recipient: '+51 955 120 044', system: 'Hotel Atmosfera', kind: 'Texto', status: 'En cola', statusTone: 'warning', time: 'hace 9 min' },
      { id: 'm4', recipient: '+51 903 778 112', system: 'Olympus Courier', kind: 'Documento', status: 'Fallido', statusTone: 'danger', time: 'hace 14 min' },
      { id: 'm5', recipient: '+51 944 210 987', system: 'Lavendimia', kind: 'Texto', status: 'Entregado', statusTone: 'success', time: 'hace 21 min' },
    ],
    recentInvoices: [
      { id: 'i1', number: 'F001-000482', company: 'Olympus Courier S.A.C.', client: 'Distribuidora Andina', total: 'S/ 1,180.00', status: 'Aceptado', statusTone: 'success', time: 'hace 3 min' },
      { id: 'i2', number: 'B001-001203', company: 'Lavendimia E.I.R.L.', client: 'Cliente varios', total: 'S/ 59.90', status: 'Aceptado', statusTone: 'success', time: 'hace 11 min' },
      { id: 'i3', number: 'F001-000481', company: 'Olympus Courier S.A.C.', client: 'Inversiones Pacífico', total: 'S/ 4,720.50', status: 'Requiere revisión', statusTone: 'warning', time: 'hace 18 min' },
      { id: 'i4', number: 'T001-000097', company: 'Olympus Courier S.A.C.', client: 'Agro Norte S.A.', total: '—', status: 'Enviado', statusTone: 'info', time: 'hace 25 min' },
      { id: 'i5', number: 'F002-000310', company: 'Hotel Atmosfera S.A.C.', client: 'Turismo Sur', total: 'S/ 2,300.00', status: 'Rechazado', statusTone: 'danger', time: 'hace 40 min' },
    ],
  }
}
