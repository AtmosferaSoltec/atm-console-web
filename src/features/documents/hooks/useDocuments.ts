import { useCallback } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { documentsQuery, getGuide, getInvoice, listGuides, listInvoices } from '../services/documentService'
import type { DocumentFiltersValue, DocumentPage, Invoice, ShippingGuide } from '../types/document.types'

interface PageResult<T> {
  page: DocumentPage<T>
  isLoading: boolean
  error: string | null
  reload: () => void
}

const EMPTY_PAGE = { items: [], total: 0, page: 1, pageSize: 20 }

export function useInvoices(filters: DocumentFiltersValue, page = 1): PageResult<Invoice> {
  // The query text is the key: a new filters object with the same values must not fetch again.
  const query = documentsQuery(filters, page)
  const fetcher = useCallback((signal: AbortSignal) => listInvoices(query, signal), [query])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { page: data ?? { ...EMPTY_PAGE, page }, isLoading, error, reload }
}

export function useGuides(filters: DocumentFiltersValue, page = 1): PageResult<ShippingGuide> {
  const query = documentsQuery(filters, page)
  const fetcher = useCallback((signal: AbortSignal) => listGuides(query, signal), [query])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { page: data ?? { ...EMPTY_PAGE, page }, isLoading, error, reload }
}

export function useInvoice(invoiceId: string | undefined) {
  const fetcher = useCallback((signal: AbortSignal) => (invoiceId ? getInvoice(invoiceId, signal) : Promise.resolve(null)), [invoiceId])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { invoice: data ?? null, isLoading, error, reload }
}

export function useGuide(guideId: string | undefined) {
  const fetcher = useCallback((signal: AbortSignal) => (guideId ? getGuide(guideId, signal) : Promise.resolve(null)), [guideId])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { guide: data ?? null, isLoading, error, reload }
}
