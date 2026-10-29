import type { Company, CompanyApiKey, CompanySeries } from '../types/company.types'

const COMPANIES: Company[] = [
  { id: 'co1', ruc: '20601234567', name: 'Olympus Courier S.A.C.', isActive: true, isTest: false, nubefactEmail: 'facturacion@olympuscourier.pe', nubefactUrl: 'https://api.nubefact.com/api/v1/8f3a1c52-7d94-4b0e-a6c1', nubefactTokenLast4: 'a91f', monthlyDocumentLimit: 1500, invoicesThisMonth: 842, guidesThisMonth: 391, activeApiKeys: 2, seriesCount: 4, createdAt: '14 ene 2026' },
  { id: 'co2', ruc: '20609876543', name: 'Lavendimia E.I.R.L.', isActive: true, isTest: false, nubefactEmail: null, nubefactUrl: 'https://api.nubefact.com/api/v1/2b7d9e10-c3a5-4f68-91d2', nubefactTokenLast4: '3c7e', monthlyDocumentLimit: 600, invoicesThisMonth: 512, guidesThisMonth: 0, activeApiKeys: 1, seriesCount: 3, createdAt: '14 ene 2026' },
  { id: 'co3', ruc: '20555123987', name: 'Hotel Atmosfera S.A.C.', isActive: true, isTest: true, nubefactEmail: 'admin@hotelatmosfera.pe', nubefactUrl: 'https://api.nubefact.com/api/v1/demo-5e8a02', nubefactTokenLast4: '0d42', monthlyDocumentLimit: 300, invoicesThisMonth: 12, guidesThisMonth: 0, activeApiKeys: 1, seriesCount: 2, createdAt: '02 feb 2026' },
  { id: 'co4', ruc: '20487654321', name: 'Agro Norte S.A.', isActive: true, isTest: false, nubefactEmail: null, nubefactUrl: 'https://api.nubefact.com/api/v1/c4d6e8f0-1a3b-4c5d-8e7f', nubefactTokenLast4: 'b5e0', monthlyDocumentLimit: 400, invoicesThisMonth: 391, guidesThisMonth: 88, activeApiKeys: 1, seriesCount: 3, createdAt: '18 feb 2026' },
  { id: 'co5', ruc: '20512345678', name: 'Turismo Sur S.A.C.', isActive: false, isTest: false, nubefactEmail: null, nubefactUrl: 'https://api.nubefact.com/api/v1/7a9b1c3d-5e7f-4a2b-9c8d', nubefactTokenLast4: '77aa', monthlyDocumentLimit: 200, invoicesThisMonth: 0, guidesThisMonth: 0, activeApiKeys: 0, seriesCount: 2, createdAt: '05 mar 2026' },
]

const SERIES: CompanySeries[] = [
  { id: 'se1', companyId: 'co1', documentType: 'FACTURA', series: 'F001', lastNumber: 482, isDefault: true, isActive: true },
  { id: 'se2', companyId: 'co1', documentType: 'BOLETA', series: 'B001', lastNumber: 1203, isDefault: true, isActive: true },
  { id: 'se3', companyId: 'co1', documentType: 'GRE_REMITENTE', series: 'T001', lastNumber: 97, isDefault: true, isActive: true },
  { id: 'se4', companyId: 'co1', documentType: 'FACTURA', series: 'F002', lastNumber: 14, isDefault: false, isActive: false },
]

const KEYS: CompanyApiKey[] = [
  { id: 'k1', companyId: 'co1', label: 'Olympus producción', prefix: 'atm_nbf_9d2c', createdAt: '14 ene 2026', lastUsedAt: 'hace 3 min', isActive: true },
  { id: 'k2', companyId: 'co1', label: 'Olympus pruebas', prefix: 'atm_nbf_41af', createdAt: '20 ene 2026', lastUsedAt: 'hace 4 días', isActive: true },
  { id: 'k3', companyId: 'co1', label: 'Integración anterior', prefix: 'atm_nbf_c07e', createdAt: '14 ene 2026', lastUsedAt: null, isActive: false },
]

/** Hardcoded sample data. Replace with real API calls when the console is wired up. */
export function getCompanies(): Company[] {
  return COMPANIES
}

export function getCompanyById(companyId: string): Company | undefined {
  return COMPANIES.find((company) => company.id === companyId)
}

export function getSeries(companyId: string): CompanySeries[] {
  return SERIES.filter((item) => item.companyId === companyId)
}

export function getApiKeys(companyId: string): CompanyApiKey[] {
  return KEYS.filter((key) => key.companyId === companyId)
}
