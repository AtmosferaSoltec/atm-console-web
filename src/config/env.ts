/** Base URL of the auth API. Empty means same origin (the Vite dev server proxies `/v1`). */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? ''

/**
 * Base URL of the storage API. The default is a same-origin prefix: in development the Vite dev server
 * strips it and forwards to the storage API; in production the host nginx must do the same.
 */
export const STORAGE_API_BASE_URL: string = import.meta.env.VITE_STORAGE_API_URL || '/storage-api'

/**
 * Base URL of the documents API. The default is a same-origin prefix: in development the Vite dev server
 * strips it and forwards to the documents API; in production the host nginx must do the same.
 */
export const DOCUMENTS_API_BASE_URL: string = import.meta.env.VITE_DOCUMENTS_API_URL || '/documents-api'

/**
 * Base URL of the messaging API. The default is a same-origin prefix: in development the Vite dev server
 * strips it and forwards to the messaging API; in production the host nginx must do the same.
 */
export const MESSAGING_API_BASE_URL: string = import.meta.env.VITE_MESSAGING_API_URL || '/messaging-api'

/**
 * Base URL of the Pulso API. The default is a same-origin prefix: in development the Vite dev server
 * strips it and forwards to the Pulso API; in production the host nginx must do the same.
 */
export const PULSO_API_BASE_URL: string = import.meta.env.VITE_PULSO_API_URL || '/pulso-api'

/**
 * Base URL of the billing API (atm-nubefact-api). The default is a same-origin prefix: in development the Vite dev
 * server strips it and forwards to the billing API; in production the host nginx must do the same.
 */
export const NUBEFACT_API_BASE_URL: string = import.meta.env.VITE_NUBEFACT_API_URL || '/nubefact-api'
