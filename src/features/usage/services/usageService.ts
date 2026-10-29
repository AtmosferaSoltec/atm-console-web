import type { CompanyUsage } from '../types/usage.types'

const USAGE: CompanyUsage[] = [
  { companyId: 'co1', name: 'Olympus Courier S.A.C.', ruc: '20601234567', isActive: true, invoices: 410, receipts: 432, greSender: 391, greCarrier: 0, used: 1233, limit: 1500 },
  { companyId: 'co2', name: 'Lavendimia E.I.R.L.', ruc: '20609876543', isActive: true, invoices: 60, receipts: 452, greSender: 0, greCarrier: 0, used: 512, limit: 600 },
  { companyId: 'co3', name: 'Hotel Atmosfera S.A.C.', ruc: '20555123987', isActive: true, invoices: 0, receipts: 0, greSender: 0, greCarrier: 0, used: 0, limit: 300 },
  { companyId: 'co4', name: 'Agro Norte S.A.', ruc: '20487654321', isActive: true, invoices: 391, receipts: 0, greSender: 40, greCarrier: 48, used: 479, limit: 400 },
  { companyId: 'co5', name: 'Turismo Sur S.A.C.', ruc: '20512345678', isActive: false, invoices: 0, receipts: 0, greSender: 0, greCarrier: 0, used: 0, limit: 200 },
]

/** Hardcoded sample data. Replace with real API calls when the console is wired up. */
export function getUsage(): CompanyUsage[] {
  return USAGE
}
