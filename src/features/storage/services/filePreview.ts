/** Types the storage API can show inline (see `previewable` in the API); anything else is download-only. */
const PREVIEWABLE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp'])

export function isPreviewable(contentType: string): boolean {
  return PREVIEWABLE_TYPES.has(contentType)
}
