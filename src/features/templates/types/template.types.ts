/** Raw bodies of the documents API (snake_case). */
export interface TemplateFormatResponse {
  code: string
  label: string
  paper: string
}

export interface TemplateResponse {
  code: string
  name: string
  description: string
  endpoint: string
  formats: TemplateFormatResponse[]
  limits: {
    max_items: Record<string, number>
    max_body_bytes: number
    max_logo_bytes: number
    max_amount: number
  }
}

export interface ServiceResponse {
  environment: string
  allowed_systems: string[]
  max_concurrent_renders: number
  render_timeout_seconds: number
}

export interface CatalogResponse {
  service: ServiceResponse
  templates: TemplateResponse[]
}

/** What the console works with. */
export interface TemplateFormat {
  code: string
  label: string
  paper: string
}

export interface TemplateLimits {
  /** Maximum lines per document, by format code. */
  maxItems: Record<string, number>
  maxBodyBytes: number
  maxLogoBytes: number
  maxAmount: number
}

export interface DocumentTemplate {
  code: string
  name: string
  description: string
  endpoint: string
  formats: TemplateFormat[]
  limits: TemplateLimits
}

export interface DocumentService {
  environment: string
  allowedSystems: string[]
  maxConcurrentRenders: number
  renderTimeoutSeconds: number
}

export interface Catalog {
  service: DocumentService
  templates: DocumentTemplate[]
}

export interface TemplatesTableProps {
  templates: DocumentTemplate[]
  emptyMessage: string
  onPreview: (template: DocumentTemplate) => void
}

export interface TemplatePreviewDialogProps {
  template: DocumentTemplate | null
  onClose: () => void
}

export interface ServiceCardProps {
  service: DocumentService
  /** Limits of the first template; they are shared by every document type for now. */
  limits: TemplateLimits | null
  /** Names of the allowed systems, by auth system code. */
  systemNames: Record<string, string>
}
