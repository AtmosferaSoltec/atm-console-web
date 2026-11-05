import { IdCard } from 'lucide-react'
import { FormField } from '@/components/common/FormField'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { cleanDocumentNumber, documentRule, documentTypeOptions } from '../services/userDocuments'
import type { DocumentFieldsProps, UserDocumentType } from '../types/user.types'

/** Type and number of the document a person signs in with. Changing the type cleans the number for it. */
export function DocumentFields({
  idPrefix,
  documentType,
  documentNumber,
  onDocumentTypeChange,
  onDocumentNumberChange,
  hint,
  autoFocus,
}: DocumentFieldsProps) {
  const rule = documentRule(documentType)

  const changeType = (value: string) => {
    const next = value as UserDocumentType
    onDocumentTypeChange(next)
    onDocumentNumberChange(cleanDocumentNumber(next, documentNumber))
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <FormField label="Tipo de documento" htmlFor={`${idPrefix}-document-type`}>
        <Select id={`${idPrefix}-document-type`} value={documentType} onValueChange={changeType} options={documentTypeOptions} />
      </FormField>
      <FormField label="Número de documento" htmlFor={`${idPrefix}-document-number`} hint={hint ? `${rule.rule} ${hint}` : rule.rule}>
        <Input
          id={`${idPrefix}-document-number`}
          inputMode={documentType === 'passport' ? 'text' : 'numeric'}
          autoCapitalize="characters"
          maxLength={rule.maxLength}
          placeholder={rule.placeholder}
          leadingIcon={IdCard}
          className="font-mono"
          value={documentNumber}
          onChange={(event) => onDocumentNumberChange(cleanDocumentNumber(documentType, event.target.value))}
          autoFocus={autoFocus}
        />
      </FormField>
    </div>
  )
}
