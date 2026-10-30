import { DOCUMENTS_API_BASE_URL } from '@/config/env'
import { request } from '@/services/httpClient'
import type { Catalog, CatalogResponse, DocumentService, DocumentTemplate, ServiceResponse, TemplateResponse } from '../types/template.types'

function toTemplate(template: TemplateResponse): DocumentTemplate {
  return {
    code: template.code,
    name: template.name,
    description: template.description,
    endpoint: template.endpoint,
    formats: template.formats,
    limits: {
      maxItems: template.limits.max_items,
      maxBodyBytes: template.limits.max_body_bytes,
      maxLogoBytes: template.limits.max_logo_bytes,
      maxAmount: template.limits.max_amount,
    },
  }
}

function toService(service: ServiceResponse): DocumentService {
  return {
    environment: service.environment,
    allowedSystems: service.allowed_systems,
    maxConcurrentRenders: service.max_concurrent_renders,
    renderTimeoutSeconds: service.render_timeout_seconds,
  }
}

export async function getCatalog(signal?: AbortSignal): Promise<Catalog> {
  const catalog = await request<CatalogResponse>('/v1/admin/templates', { baseUrl: DOCUMENTS_API_BASE_URL, signal })
  return { service: toService(catalog.service), templates: catalog.templates.map(toTemplate) }
}

/**
 * Renders the template with fictional data and returns an object URL for the PDF.
 * The caller must release it with `URL.revokeObjectURL`.
 */
export async function getPreviewUrl(code: string, format: string, signal?: AbortSignal): Promise<string> {
  const params = new URLSearchParams({ format })
  const pdf = await request<Blob>(`/v1/admin/templates/${encodeURIComponent(code)}/preview?${params}`, {
    baseUrl: DOCUMENTS_API_BASE_URL,
    responseType: 'blob',
    signal,
  })
  return URL.createObjectURL(pdf)
}
