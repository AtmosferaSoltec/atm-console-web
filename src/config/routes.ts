export const ROUTES = {
  login: '/login',
  /** Public page a customer opens from a link to scan their WhatsApp QR. */
  connect: '/connect/:token',
  dashboard: '/dashboard',
  auth: {
    systems: '/auth/systems',
    systemDetail: '/auth/systems/:systemId',
    clients: '/auth/clients',
    tenants: '/auth/tenants',
    users: '/auth/users',
    userDetail: '/auth/users/:userId',
  },
  messaging: {
    sessions: '/messaging/sessions',
    systems: '/messaging/systems',
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
    activity: '/documents/activity',
  },
  storage: {
    overview: '/storage/overview',
    files: '/storage/files',
  },
  lavendimia: {
    companies: '/lavendimia/companies',
    users: '/lavendimia/users',
    roles: '/lavendimia/roles',
  },
  pulso: {
    branches: '/pulso/branches',
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
