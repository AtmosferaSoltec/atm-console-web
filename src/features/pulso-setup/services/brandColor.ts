export const BRAND_COLORS = ['#17677b', '#0fa68f', '#2f4f8f', '#6b3fa0', '#b4471b', '#c0392b', '#3d6b45', '#1a1a1a']

/** "17677B", "#abc" or "#AABBCC" become "#rrggbb" in lowercase; anything else is null. */
export function normalizeHex(input: string): string | null {
  const digits = input.trim().replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(digits)) return `#${[...digits].map((digit) => digit + digit).join('')}`.toLowerCase()
  if (/^[0-9a-f]{6}$/i.test(digits)) return `#${digits}`.toLowerCase()
  return null
}
