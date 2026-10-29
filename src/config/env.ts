/** Base URL of the auth API. Empty means same origin (the Vite dev server proxies `/v1`). */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? ''
