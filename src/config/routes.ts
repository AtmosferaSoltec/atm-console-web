export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  auth: {
    systems: '/auth/systems',
    systemDetail: '/auth/systems/:systemId',
    tenants: '/auth/tenants',
    users: '/auth/users',
    userDetail: '/auth/users/:userId',
  },
  messaging: {
    sessions: '/messaging/sessions',
    apiClients: '/messaging/api-clients',
    messages: '/messaging/messages',
  },
  billing: {
    companies: '/billing/companies',
    companyNew: '/billing/companies/new',
    companyDetail: '/billing/companies/:companyId',
    invoices: '/billing/invoices',
    invoiceDetail: '/billing/invoices/:invoiceId',
    shippingGuides: '/billing/shipping-guides',
    shippingGuideDetail: '/billing/shipping-guides/:guideId',
    usage: '/billing/usage',
  },
  identity: {
    usage: '/identity/usage',
    systems: '/identity/systems',
    records: '/identity/records',
  },
  documents: {
    templates: '/documents/templates',
    generated: '/documents/generated',
  },
  storage: {
    buckets: '/storage/buckets',
    files: '/storage/files',
  },
} as const

export function systemPath(systemId: string): string {
  return `/auth/systems/${systemId}`
}

export function userPath(userId: string): string {
  return `/auth/users/${userId}`
}

export function companyPath(companyId: string): string {
  return `/billing/companies/${companyId}`
}

export function invoicePath(invoiceId: string): string {
  return `/billing/invoices/${invoiceId}`
}

export function shippingGuidePath(guideId: string): string {
  return `/billing/shipping-guides/${guideId}`
}
