import { getGeneratedDocuments, getTemplates } from '../services/templateService'
import type { DocumentTemplate, GeneratedDocument } from '../types/template.types'

export function useTemplates(): DocumentTemplate[] {
  return getTemplates()
}

export function useGeneratedDocuments(): GeneratedDocument[] {
  return getGeneratedDocuments()
}
