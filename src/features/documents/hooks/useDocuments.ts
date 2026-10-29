import { getGuideById, getGuides, getInvoiceById, getInvoices } from '../services/documentService'
import type { DocumentFiltersValue, Invoice, ShippingGuide } from '../types/document.types'

export function useInvoices(filters: DocumentFiltersValue): Invoice[] {
  return getInvoices(filters)
}

export function useInvoice(invoiceId: string | undefined): Invoice | undefined {
  return invoiceId ? getInvoiceById(invoiceId) : undefined
}

export function useGuides(filters: DocumentFiltersValue): ShippingGuide[] {
  return getGuides(filters)
}

export function useGuide(guideId: string | undefined): ShippingGuide | undefined {
  return guideId ? getGuideById(guideId) : undefined
}
