/** Longest category name pulso-api accepts. */
export const MAX_CATEGORY_NAME = 40

export interface ParsedCategoryNames {
  /** One per line, spaces collapsed, blank lines and repeats (ignoring case) dropped. */
  names: string[]
  /** Lines longer than MAX_CATEGORY_NAME: nothing is sent until they are fixed. */
  tooLong: string[]
}

/** Reads the textarea of the console: one category name per line. */
export function parseCategoryNames(text: string): ParsedCategoryNames {
  const seen = new Set<string>()
  const names: string[] = []
  const tooLong: string[] = []
  for (const line of text.split('\n')) {
    const name = line.split(/\s+/).filter(Boolean).join(' ')
    if (!name) continue
    if ([...name].length > MAX_CATEGORY_NAME) {
      tooLong.push(name)
      continue
    }
    const key = name.toLocaleLowerCase('es')
    if (seen.has(key)) continue
    seen.add(key)
    names.push(name)
  }
  return { names, tooLong }
}
