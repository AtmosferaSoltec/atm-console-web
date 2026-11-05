import type { UserDocumentType, UserItem } from '../types/user.types'

interface DocumentRule {
  label: string
  short: string
  placeholder: string
  rule: string
  pattern: RegExp
  maxLength: number
}

/** The rules of atm-auth-api, which is the one that decides. */
const DOCUMENT_RULES: Record<UserDocumentType, DocumentRule> = {
  dni: { label: 'DNI', short: 'DNI', placeholder: 'Ingresa el DNI', rule: '8 dígitos.', pattern: /^\d{8}$/, maxLength: 8 },
  ce: { label: 'Carné de extranjería', short: 'CE', placeholder: 'Ingresa el carné', rule: 'De 9 a 12 dígitos.', pattern: /^\d{9,12}$/, maxLength: 12 },
  passport: {
    label: 'Pasaporte u otro documento',
    short: 'Pasaporte',
    placeholder: 'Ingresa el pasaporte',
    rule: 'De 6 a 12 letras o números.',
    pattern: /^[A-Z0-9]{6,12}$/,
    maxLength: 12,
  },
}

export const documentTypeOptions = (Object.keys(DOCUMENT_RULES) as UserDocumentType[]).map((value) => ({
  value,
  label: DOCUMENT_RULES[value].label,
}))

export const documentRule = (documentType: UserDocumentType): DocumentRule => DOCUMENT_RULES[documentType]

/** Cleans what is typed: digits for a DNI or a CE; letters and digits in upper case for a passport. */
export function cleanDocumentNumber(documentType: UserDocumentType, value: string): string {
  const clean = documentType === 'passport' ? value.toUpperCase().replace(/[^A-Z0-9]/g, '') : value.replace(/\D/g, '')
  return clean.slice(0, DOCUMENT_RULES[documentType].maxLength)
}

export const isValidDocument = (documentType: UserDocumentType, documentNumber: string): boolean =>
  DOCUMENT_RULES[documentType].pattern.test(documentNumber)

/** "DNI 12345678", "CE 001234567", "Pasaporte BO123456"; empty when the account has no document. */
export function formatUserDocument(user: Pick<UserItem, 'documentType' | 'documentNumber'>): string {
  if (!user.documentNumber) return ''
  return `${DOCUMENT_RULES[user.documentType || 'dni'].short} ${user.documentNumber}`
}
