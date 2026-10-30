import {
  Activity,
  Briefcase,
  Building2,
  Database,
  FileText,
  Files,
  Gauge,
  HardDrive,
  KeyRound,
  Layers,
  LayoutTemplate,
  MessagesSquare,
  Receipt,
  Smartphone,
  Truck,
  Users,
  Workflow,
} from 'lucide-react'
import type { NavGroup } from '@/types/navigation.types'
import { ROUTES } from './routes'

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Autenticación',
    items: [
      { label: 'Sistemas', to: ROUTES.auth.systems, icon: Layers },
      { label: 'Clientes', to: ROUTES.auth.clients, icon: Briefcase },
      { label: 'Empresas', to: ROUTES.auth.tenants, icon: Building2 },
      { label: 'Usuarios', to: ROUTES.auth.users, icon: Users },
    ],
  },
  {
    label: 'Mensajería',
    items: [
      { label: 'Conexiones', to: ROUTES.messaging.sessions, icon: Smartphone },
      { label: 'Sistemas', to: ROUTES.messaging.systems, icon: Workflow },
      { label: 'Mensajes', to: ROUTES.messaging.messages, icon: MessagesSquare },
    ],
  },
  {
    label: 'Facturación',
    items: [
      { label: 'Emisores', to: ROUTES.billing.companies, icon: Receipt },
      { label: 'Comprobantes', to: ROUTES.billing.invoices, icon: FileText },
      { label: 'Guías de remisión', to: ROUTES.billing.shippingGuides, icon: Truck },
      { label: 'Consumo', to: ROUTES.billing.usage, icon: Gauge },
    ],
  },
  {
    label: 'Identidad',
    items: [
      { label: 'Consumo', to: ROUTES.identity.usage, icon: Activity },
      { label: 'Sistemas con acceso', to: ROUTES.identity.systems, icon: KeyRound },
      { label: 'Datos guardados', to: ROUTES.identity.records, icon: Database },
    ],
  },
  {
    label: 'Documentos',
    items: [
      { label: 'Plantillas', to: ROUTES.documents.templates, icon: LayoutTemplate },
      { label: 'Actividad', to: ROUTES.documents.activity, icon: Activity },
    ],
  },
  {
    label: 'Almacenamiento',
    items: [
      { label: 'Resumen', to: ROUTES.storage.overview, icon: HardDrive },
      { label: 'Archivos', to: ROUTES.storage.files, icon: Files },
    ],
  },
]
