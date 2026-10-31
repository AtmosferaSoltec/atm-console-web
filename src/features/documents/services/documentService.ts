import { format } from 'date-fns'
import { NUBEFACT_API_BASE_URL } from '@/config/env'
import { request } from '@/services/httpClient'
import type {
  DocumentFiltersValue,
  DocumentPage,
  GuideResponse,
  Invoice,
  InvoiceResponse,
  PageResponse,
  ShippingGuide,
} from '../types/document.types'

export const EMPTY_DOCUMENT_FILTERS: DocumentFiltersValue = { companyId: 'all', documentType: 'all', status: 'all', account: 'all', range: undefined, search: '' }

export const DOCUMENTS_PAGE_SIZE = 20
const BASE = { baseUrl: NUBEFACT_API_BASE_URL }
const DAY = 'yyyy-MM-dd'

function toInvoice(invoice: InvoiceResponse): Invoice {
  return {
    id: invoice.id,
    documentType: invoice.documentType,
    series: invoice.series,
    number: invoice.number,
    companyId: invoice.company.id,
    companyName: invoice.company.name,
    clientName: invoice.clientName,
    clientDocument: invoice.clientDocumentNumber,
    total: Number(invoice.total),
    currency: invoice.currency,
    status: invoice.status,
    isTest: invoice.isTest,
    createdAt: invoice.createdAt,
    updatedAt: invoice.updatedAt,
    externalReference: invoice.externalReference,
    sunatDescription: invoice.sunatDescription,
    sunatCode: invoice.sunatResponseCode,
    sunatChecks: invoice.sunatCheckAttempts,
    lastSunatCheck: invoice.lastSunatCheckAt,
    voidReason: invoice.voidReason,
    nubefactLink: invoice.nubefactLink,
    pdfLink: invoice.nubefactPdfLink,
    xmlLink: invoice.nubefactXmlLink,
    cdrLink: invoice.nubefactCdrLink,
  }
}

function toGuide(guide: GuideResponse): ShippingGuide {
  return {
    id: guide.id,
    documentType: guide.documentType,
    series: guide.series,
    number: guide.number,
    companyId: guide.company.id,
    companyName: guide.company.name,
    clientName: guide.clientName,
    clientDocument: guide.clientDocumentNumber,
    recipient: guide.destinatarioDenominacion,
    transferDate: guide.fechaDeInicioDeTraslado,
    status: guide.status,
    isTest: guide.isTest,
    createdAt: guide.createdAt,
    updatedAt: guide.updatedAt,
    sunatDescription: guide.sunatDescription,
    sunatCode: guide.sunatResponseCode ?? null,
    sunatChecks: guide.sunatCheckAttempts ?? 0,
    lastSunatCheck: guide.lastSunatCheckAt ?? null,
    nubefactLink: guide.nubefactLink ?? null,
    pdfLink: guide.nubefactPdfLink ?? null,
    xmlLink: guide.nubefactXmlLink ?? null,
    cdrLink: guide.nubefactCdrLink ?? null,
  }
}

/** The query string of a list: the filters of the screen as the API names them. */
export function documentsQuery(filters: DocumentFiltersValue, page: number): string {
  const params = new URLSearchParams({ page: String(page), pageSize: String(DOCUMENTS_PAGE_SIZE) })
  if (filters.companyId !== 'all') params.set('companyId', filters.companyId)
  if (filters.documentType !== 'all') params.set('documentType', filters.documentType)
  if (filters.status !== 'all') params.set('status', filters.status)
  if (filters.account !== 'all') params.set('isTest', String(filters.account === 'test'))
  if (filters.range?.from) params.set('from', format(filters.range.from, DAY))
  if (filters.range?.to) params.set('to', format(filters.range.to, DAY))
  if (filters.search.trim()) params.set('search', filters.search.trim())
  return params.toString()
}

export async function listInvoices(query: string, signal?: AbortSignal): Promise<DocumentPage<Invoice>> {
  const page = await request<PageResponse<InvoiceResponse>>(`/admin/invoices?${query}`, { ...BASE, signal })
  return { items: page.data.map(toInvoice), total: page.total, page: page.page, pageSize: page.pageSize }
}

export async function getInvoice(invoiceId: string, signal?: AbortSignal): Promise<Invoice> {
  return toInvoice(await request<InvoiceResponse>(`/admin/invoices/${invoiceId}`, { ...BASE, signal }))
}

/** Asks SUNAT again right now, restarting the attempts. */
export async function recheckInvoice(invoiceId: string): Promise<Invoice> {
  return toInvoice(await request<InvoiceResponse>(`/admin/invoices/${invoiceId}/recheck`, { ...BASE, method: 'POST' }))
}

export async function listGuides(query: string, signal?: AbortSignal): Promise<DocumentPage<ShippingGuide>> {
  const page = await request<PageResponse<GuideResponse>>(`/admin/shipping-guides?${query}`, { ...BASE, signal })
  return { items: page.data.map(toGuide), total: page.total, page: page.page, pageSize: page.pageSize }
}

export async function getGuide(guideId: string, signal?: AbortSignal): Promise<ShippingGuide> {
  return toGuide(await request<GuideResponse>(`/admin/shipping-guides/${guideId}`, { ...BASE, signal }))
}

export async function recheckGuide(guideId: string): Promise<ShippingGuide> {
  return toGuide(await request<GuideResponse>(`/admin/shipping-guides/${guideId}/recheck`, { ...BASE, method: 'POST' }))
}
