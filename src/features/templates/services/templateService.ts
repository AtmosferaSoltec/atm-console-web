import type { DocumentTemplate, GeneratedDocument } from '../types/template.types'

const TEMPLATES: DocumentTemplate[] = [
  { id: 't1', name: 'Cotización', systemName: 'Olympus', format: 'pdf', version: 4, isActive: true, updatedAt: '12 oct 2026' },
  { id: 't2', name: 'Contrato de servicio', systemName: 'Olympus', format: 'pdf', version: 2, isActive: true, updatedAt: '03 sep 2026' },
  { id: 't3', name: 'Recibo de pago', systemName: 'Lavendimia', format: 'pdf', version: 7, isActive: true, updatedAt: '27 oct 2026' },
  { id: 't4', name: 'Constancia de reserva', systemName: 'Hotel Atmosfera', format: 'pdf', version: 1, isActive: true, updatedAt: '15 jul 2026' },
  { id: 't5', name: 'Bienvenida', systemName: 'Autenticación', format: 'email', version: 3, isActive: false, updatedAt: '20 ago 2026' },
]

const GENERATED: GeneratedDocument[] = [
  { id: 'd1', templateName: 'Recibo de pago', systemName: 'Lavendimia', status: 'ready', size: '92 KB', createdAt: 'hace 2 min' },
  { id: 'd2', templateName: 'Cotización', systemName: 'Olympus', status: 'ready', size: '148 KB', createdAt: 'hace 11 min' },
  { id: 'd3', templateName: 'Constancia de reserva', systemName: 'Hotel Atmosfera', status: 'processing', size: null, createdAt: 'hace 12 min' },
  { id: 'd4', templateName: 'Contrato de servicio', systemName: 'Olympus', status: 'failed', size: null, createdAt: 'hace 40 min' },
  { id: 'd5', templateName: 'Recibo de pago', systemName: 'Lavendimia', status: 'ready', size: '90 KB', createdAt: 'hace 1 h' },
]

/** Hardcoded sample data. Replace with real API calls when the console is wired up. */
export function getTemplates(): DocumentTemplate[] {
  return TEMPLATES
}

export function getGeneratedDocuments(): GeneratedDocument[] {
  return GENERATED
}
