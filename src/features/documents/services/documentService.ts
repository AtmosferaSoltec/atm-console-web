import type { DocumentFiltersValue, Invoice, ShippingGuide } from '../types/document.types'

export const EMPTY_DOCUMENT_FILTERS: DocumentFiltersValue = { companyId: 'all', documentType: 'all', status: 'all', account: 'all', range: undefined, search: '' }

const SUNAT_OK = { sunatDescription: 'La Factura numero ha sido aceptada', sunatCode: '0', sunatChecks: 1, lastSunatCheck: '29 oct 2026, 10:42' }

const INVOICES: Invoice[] = [
  { id: 'i1', documentType: 'FACTURA', series: 'F001', number: 482, companyId: 'co1', companyName: 'Olympus Courier S.A.C.', clientName: 'Distribuidora Andina S.A.C.', clientDocument: '20481234567', total: 1180, currency: 'PEN', status: 'ACCEPTED', isTest: false, createdAt: '29 oct 2026, 10:38', updatedAt: '29 oct 2026, 10:42', externalReference: 'ORD-88213', voidReason: null, ...SUNAT_OK },
  { id: 'i2', documentType: 'BOLETA', series: 'B001', number: 1203, companyId: 'co2', companyName: 'Lavendimia E.I.R.L.', clientName: 'Clientes varios', clientDocument: '00000000', total: 59.9, currency: 'PEN', status: 'ACCEPTED', isTest: false, createdAt: '29 oct 2026, 10:30', updatedAt: '29 oct 2026, 10:31', externalReference: 'POS-5521', voidReason: null, ...SUNAT_OK },
  { id: 'i3', documentType: 'FACTURA', series: 'F001', number: 481, companyId: 'co1', companyName: 'Olympus Courier S.A.C.', clientName: 'Inversiones Pacífico S.A.C.', clientDocument: '20498765432', total: 4720.5, currency: 'PEN', status: 'NEEDS_REVIEW', isTest: false, createdAt: '29 oct 2026, 10:21', updatedAt: '29 oct 2026, 10:40', externalReference: 'ORD-88190', voidReason: null, sunatDescription: 'SUNAT no confirmó la respuesta', sunatCode: '', sunatChecks: 6, lastSunatCheck: '29 oct 2026, 10:40' },
  { id: 'i4', documentType: 'FACTURA', series: 'F002', number: 310, companyId: 'co4', companyName: 'Agro Norte S.A.', clientName: 'Turismo Sur S.A.C.', clientDocument: '20512345678', total: 2300, currency: 'PEN', status: 'REJECTED', isTest: false, createdAt: '29 oct 2026, 09:58', updatedAt: '29 oct 2026, 09:59', externalReference: 'FAC-2210', voidReason: null, sunatDescription: 'El RUC del receptor no existe', sunatCode: '2800', sunatChecks: 1, lastSunatCheck: '29 oct 2026, 09:59' },
  { id: 'i5', documentType: 'BOLETA', series: 'B001', number: 1202, companyId: 'co2', companyName: 'Lavendimia E.I.R.L.', clientName: 'Rosa Elena Chávez Ortiz', clientDocument: '43698521', total: 129, currency: 'PEN', status: 'SUBMITTED', isTest: false, createdAt: '29 oct 2026, 09:47', updatedAt: '29 oct 2026, 09:47', externalReference: 'POS-5520', voidReason: null, sunatDescription: 'Pendiente de respuesta', sunatCode: '', sunatChecks: 0, lastSunatCheck: '—' },
  { id: 'i6', documentType: 'FACTURA', series: 'F001', number: 12, companyId: 'co3', companyName: 'Hotel Atmosfera S.A.C.', clientName: 'Agencia Viajes Perú', clientDocument: '20601112223', total: 850, currency: 'USD', status: 'ACCEPTED', isTest: true, createdAt: '28 oct 2026, 17:12', updatedAt: '28 oct 2026, 17:12', externalReference: 'RES-0091', voidReason: null, ...SUNAT_OK },
  { id: 'i7', documentType: 'FACTURA', series: 'F001', number: 470, companyId: 'co1', companyName: 'Olympus Courier S.A.C.', clientName: 'Comercial Los Andes', clientDocument: '20455667788', total: 640, currency: 'PEN', status: 'VOIDED', isTest: false, createdAt: '27 oct 2026, 15:03', updatedAt: '28 oct 2026, 09:10', externalReference: 'ORD-88011', voidReason: 'Error en el monto facturado', ...SUNAT_OK },
  { id: 'i8', documentType: 'BOLETA', series: 'B001', number: 1190, companyId: 'co2', companyName: 'Lavendimia E.I.R.L.', clientName: 'Clientes varios', clientDocument: '00000000', total: 35, currency: 'PEN', status: 'PENDING', isTest: false, createdAt: '27 oct 2026, 11:20', updatedAt: '27 oct 2026, 11:20', externalReference: 'POS-5499', voidReason: null, sunatDescription: 'En cola de envío', sunatCode: '', sunatChecks: 0, lastSunatCheck: '—' },
]

const GUIDES: ShippingGuide[] = [
  { id: 'g1', documentType: 'GRE_REMITENTE', series: 'T001', number: 97, companyId: 'co1', companyName: 'Olympus Courier S.A.C.', clientName: 'Agro Norte S.A.', clientDocument: '20487654321', recipient: 'Almacén Trujillo', transferDate: '29 oct 2026', status: 'SUBMITTED', isTest: false, createdAt: '29 oct 2026, 10:25', sunatDescription: 'Pendiente de respuesta', sunatCode: '', sunatChecks: 0, lastSunatCheck: '—' },
  { id: 'g2', documentType: 'GRE_REMITENTE', series: 'T001', number: 96, companyId: 'co1', companyName: 'Olympus Courier S.A.C.', clientName: 'Distribuidora Andina S.A.C.', clientDocument: '20481234567', recipient: 'Tienda Miraflores', transferDate: '29 oct 2026', status: 'ACCEPTED', isTest: false, createdAt: '29 oct 2026, 09:40', sunatDescription: 'La guía ha sido aceptada', sunatCode: '0', sunatChecks: 1, lastSunatCheck: '29 oct 2026, 09:42' },
  { id: 'g3', documentType: 'GRE_TRANSPORTISTA', series: 'V001', number: 31, companyId: 'co4', companyName: 'Agro Norte S.A.', clientName: 'Inversiones Pacífico S.A.C.', clientDocument: '20498765432', recipient: null, transferDate: '28 oct 2026', status: 'NEEDS_REVIEW', isTest: false, createdAt: '28 oct 2026, 16:02', sunatDescription: 'SUNAT no confirmó la respuesta', sunatCode: '', sunatChecks: 6, lastSunatCheck: '28 oct 2026, 16:40' },
  { id: 'g4', documentType: 'GRE_REMITENTE', series: 'T001', number: 95, companyId: 'co1', companyName: 'Olympus Courier S.A.C.', clientName: 'Comercial Los Andes', clientDocument: '20455667788', recipient: 'Sucursal Cusco', transferDate: '28 oct 2026', status: 'REJECTED', isTest: false, createdAt: '28 oct 2026, 11:18', sunatDescription: 'Ubigeo de llegada inválido', sunatCode: '3115', sunatChecks: 1, lastSunatCheck: '28 oct 2026, 11:19' },
  { id: 'g5', documentType: 'GRE_REMITENTE', series: 'T001', number: 94, companyId: 'co1', companyName: 'Olympus Courier S.A.C.', clientName: 'Turismo Sur S.A.C.', clientDocument: '20512345678', recipient: 'Hotel Arequipa', transferDate: '27 oct 2026', status: 'ACCEPTED', isTest: false, createdAt: '27 oct 2026, 14:50', sunatDescription: 'La guía ha sido aceptada', sunatCode: '0', sunatChecks: 1, lastSunatCheck: '27 oct 2026, 14:52' },
]

/** Hardcoded sample data. Replace with real API calls when the console is wired up. */
export function getInvoices(filters: DocumentFiltersValue): Invoice[] {
  const term = filters.search.trim().toLowerCase()
  return INVOICES.filter(
    (invoice) =>
      (filters.companyId === 'all' || invoice.companyId === filters.companyId) &&
      (filters.documentType === 'all' || invoice.documentType === filters.documentType) &&
      (filters.status === 'all' || invoice.status === filters.status) &&
      (filters.account === 'all' || invoice.isTest === (filters.account === 'test')) &&
      (term === '' || `${invoice.series}-${invoice.number}`.toLowerCase().includes(term) || invoice.clientName.toLowerCase().includes(term) || invoice.clientDocument.includes(term)),
  )
}

export function getInvoiceById(invoiceId: string): Invoice | undefined {
  return INVOICES.find((invoice) => invoice.id === invoiceId)
}

export function getGuides(filters: DocumentFiltersValue): ShippingGuide[] {
  const term = filters.search.trim().toLowerCase()
  return GUIDES.filter(
    (guide) =>
      (filters.companyId === 'all' || guide.companyId === filters.companyId) &&
      (filters.documentType === 'all' || guide.documentType === filters.documentType) &&
      (filters.status === 'all' || guide.status === filters.status) &&
      (filters.account === 'all' || guide.isTest === (filters.account === 'test')) &&
      (term === '' || `${guide.series}-${guide.number}`.toLowerCase().includes(term) || guide.clientName.toLowerCase().includes(term) || (guide.recipient ?? '').toLowerCase().includes(term)),
  )
}

export function getGuideById(guideId: string): ShippingGuide | undefined {
  return GUIDES.find((guide) => guide.id === guideId)
}
