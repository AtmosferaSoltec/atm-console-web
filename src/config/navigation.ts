import {
  Activity,
  Building2,
  Database,
  FileCheck,
  FileText,
  Files,
  Gauge,
  KeyRound,
  Layers,
  LayoutTemplate,
  MessagesSquare,
  Package,
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
      { label: 'Empresas', to: ROUTES.auth.tenants, icon: Building2 },
      { label: 'Usuarios', to: ROUTES.auth.users, icon: Users },
    ],
  },
  {
    label: 'Mensajería',
    items: [
      { label: 'Conexiones', to: ROUTES.messaging.sessions, icon: Smartphone },
      { label: 'Sistemas cliente', to: ROUTES.messaging.apiClients, icon: Workflow },
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
      { label: 'Generados', to: ROUTES.documents.generated, icon: FileCheck },
    ],
  },
  {
    label: 'Almacenamiento',
    items: [
      { label: 'Buckets', to: ROUTES.storage.buckets, icon: Package },
      { label: 'Archivos', to: ROUTES.storage.files, icon: Files },
    ],
  },
]
