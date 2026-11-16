import { BarChart3, CreditCard, DoorOpen, Dumbbell, Puzzle, ShoppingBag, Tablet, UserCog, Users } from 'lucide-react'
import type { PulsoModuleResponse } from '@/features/pulso/types/pulso.types'
import type { Company, ModuleInfo, ModuleKind, PulsoModule } from '../types/pulsoSetup.types'

/**
 * The Spanish face of each module code pulso-api publishes in `GET /admin/modules`. The API decides which modules
 * exist and which can be switched; the console only names them. A new code shows with its raw name until it is
 * added here.
 */
const MODULE_INFO: Record<string, ModuleInfo> = {
  members: {
    name: 'Socios y membresías',
    description: 'Inscripción de socios, planes, renovaciones y boletas.',
    icon: Users,
    includes: ['Ficha del socio con documento y celular', 'Planes y tarifas', 'Renovaciones y correcciones'],
  },
  payments: {
    name: 'Pagos e ingresos',
    description: 'Cobros en efectivo, tarjeta, Yape o transferencia, con comprobantes.',
    icon: CreditCard,
    includes: ['Boletas numeradas', 'Comprobantes de pago adjuntos', 'Ingresos por método de pago'],
  },
  access: {
    name: 'Control de acceso',
    description: 'Registro de ingresos por documento y validación de membresía.',
    icon: DoorOpen,
    includes: ['Validación de membresía al ingresar', 'Historial de ingresos'],
  },
  kiosk: {
    name: 'Modo quiosco',
    description: 'Una tablet en la puerta donde el socio marca su ingreso solo.',
    icon: Tablet,
    includes: ['Pantalla completa sin menú', 'PIN de salida', 'Mensajes de bienvenida y vencimiento'],
  },
  reports: {
    name: 'Resumen y reportes',
    description: 'Resumen del día, ingresos del mes y socios por vencer.',
    icon: BarChart3,
    includes: ['Resumen del gimnasio', 'Socios por vencer'],
  },
  team: {
    name: 'Usuarios y permisos',
    description: 'El administrador del gimnasio gestiona a su personal de recepción.',
    icon: UserCog,
    includes: ['Roles administrador y recepción', 'Sedes asignadas por persona'],
  },
  sales: {
    name: 'Venta de productos',
    description: 'Catálogo de productos, stock y venta rápida en recepción.',
    icon: ShoppingBag,
    includes: ['Productos con precio y stock', 'Venta al contado o a cuenta del socio', 'Saldo pendiente del socio'],
  },
  body_tracking: {
    name: 'Medidas corporales',
    description: 'Peso y medidas de cada socio, con su evolución.',
    icon: Dumbbell,
    includes: ['Registro de peso y medidas', 'Evolución en la ficha del socio'],
  },
}

export const KIND_LABELS: Record<ModuleKind, string> = {
  base: 'Base',
  optional: 'Opcional',
}

export const KIND_DESCRIPTIONS: Record<ModuleKind, string> = {
  base: 'Todas las empresas lo tienen. No se puede apagar.',
  optional: 'Disponible para cualquier empresa. Tú decides quién lo usa.',
}

export function toModules(catalog: PulsoModuleResponse[]): PulsoModule[] {
  return catalog.map((entry) => {
    const info = MODULE_INFO[entry.code]
    return {
      code: entry.code,
      kind: entry.kind === 'optional' ? 'optional' : 'base',
      switchable: entry.switchable,
      requires: entry.requires ?? [],
      name: info?.name ?? entry.code,
      description: info?.description ?? '',
      icon: info?.icon ?? Puzzle,
      includes: info?.includes ?? [],
    }
  })
}

export function moduleName(modules: PulsoModule[], code: string): string {
  return modules.find((module) => module.code === code)?.name ?? MODULE_INFO[code]?.name ?? code
}

/** Whether the company has the module: base modules always, the rest when switched on. */
export function companyHasModule(modules: PulsoModule[], company: Pick<Company, 'modules'>, code: string): boolean {
  const module = modules.find((item) => item.code === code)
  if (!module) return false
  return module.kind === 'base' || company.modules.includes(code)
}

/** Codes of the switchable modules `module` needs: the only requirements worth showing. */
export function switchableRequirements(modules: PulsoModule[], module: PulsoModule): string[] {
  return module.requires.filter((code) => modules.find((item) => item.code === code)?.kind !== 'base')
}

/** Names of the modules `module` needs that the company does not have yet. */
export function missingRequirements(modules: PulsoModule[], company: Pick<Company, 'modules'>, module: PulsoModule): string[] {
  return module.requires.filter((code) => !companyHasModule(modules, company, code)).map((code) => moduleName(modules, code))
}

/** Switched-on modules that depend on `code`: they go off with it. */
export function dependentModules(modules: PulsoModule[], company: Pick<Company, 'modules'>, code: string): PulsoModule[] {
  return modules.filter((module) => module.requires.includes(code) && company.modules.includes(module.code))
}
