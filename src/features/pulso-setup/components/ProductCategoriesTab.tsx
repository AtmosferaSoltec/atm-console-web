import { Check, Pencil, Plus, Tag, Trash2, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useApiQuery } from '@/hooks/useApiQuery'
import { addProductCategories, listProductCategories, pulsoErrorMessage, usePulsoActions } from '@/features/pulso'
import type { ProductCategory } from '@/features/pulso'
import { MAX_CATEGORY_NAME, parseCategoryNames } from '../services/categoryNames'
import type { CompanyTabProps } from '../types/pulsoSetup.types'
import { LoadState } from './LoadState'

function productsLabel(count: number): string {
  return count === 1 ? '1 producto' : `${count} productos`
}

/**
 * The gym's product categories (module sales). Atmósfera usually loads them for the gym: many at once, one per
 * line, skipping the ones the gym already has. The gym's admin can also manage them from Pulso.
 */
export function ProductCategoriesTab({ company }: CompanyTabProps) {
  const fetcher = useCallback((signal: AbortSignal) => listProductCategories(company.id, signal), [company.id])
  const { data: categories, error: loadError, reload } = useApiQuery<ProductCategory[]>(fetcher)
  const [text, setText] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState<ProductCategory | null>(null)
  const { renameCategory, removeCategory, isBusy, error } = usePulsoActions()
  const parsed = parseCategoryNames(text)

  const add = async () => {
    if (parsed.names.length === 0 || parsed.tooLong.length > 0) return
    setAdding(true)
    setAddError(null)
    setResult(null)
    try {
      const { created, skipped } = await addProductCategories(company.id, parsed.names)
      const parts = [created.length === 1 ? 'Se agregó 1 categoría.' : `Se agregaron ${created.length} categorías.`]
      if (skipped.length) parts.push(`Ya existían: ${skipped.join(', ')}.`)
      setResult(parts.join(' '))
      setText('')
      reload()
    } catch (caught) {
      setAddError(pulsoErrorMessage(caught, 'No se pudieron agregar las categorías. Intenta de nuevo.'))
    } finally {
      setAdding(false)
    }
  }

  const saveName = async () => {
    if (!editing) return
    const name = editing.name.trim()
    if (!name || [...name].length > MAX_CATEGORY_NAME) return
    if (await renameCategory(company.id, editing.id, name)) {
      setEditing(null)
      reload()
    }
  }

  if (!categories) return <LoadState error={loadError} onRetry={reload} />

  return (
    <div className="space-y-5">
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          void add()
        }}
      >
        <FormField label="Agregar categorías" htmlFor="category-names" hint="Una por línea. Las que el gimnasio ya tiene se omiten.">
          <Textarea id="category-names" value={text} placeholder={'Batidos\nSuplementos\nMaterial'} rows={5} onChange={(event) => setText(event.target.value)} />
        </FormField>
        {parsed.tooLong.length > 0 && (
          <p role="alert" className="text-sm text-red-600">
            Máximo {MAX_CATEGORY_NAME} caracteres por categoría: {parsed.tooLong.join(', ')}.
          </p>
        )}
        {addError && (
          <p role="alert" className="text-sm text-red-600">
            {addError}
          </p>
        )}
        {result && (
          <p role="status" className="text-sm text-emerald-700">
            {result}
          </p>
        )}
        <Button type="submit" disabled={adding || parsed.names.length === 0 || parsed.tooLong.length > 0}>
          <Plus className="size-4" />
          {parsed.names.length > 1 ? `Agregar ${parsed.names.length} categorías` : 'Agregar'}
        </Button>
      </form>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {categories.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 px-5 py-8 text-center text-sm text-slate-500">
          Este gimnasio aún no tiene categorías de productos.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-3 px-5 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Tag className="size-[18px]" />
              </span>
              {editing?.id === category.id ? (
                <form
                  className="flex min-w-0 flex-1 items-center gap-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void saveName()
                  }}
                >
                  <Input
                    aria-label="Nombre de la categoría"
                    value={editing.name}
                    maxLength={MAX_CATEGORY_NAME}
                    autoFocus
                    onChange={(event) => setEditing({ id: category.id, name: event.target.value })}
                  />
                  <Button type="submit" variant="ghost" size="icon" aria-label="Guardar nombre" disabled={isBusy || !editing.name.trim()}>
                    <Check className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Cancelar" onClick={() => setEditing(null)}>
                    <X className="size-4" />
                  </Button>
                </form>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{category.name}</p>
                    <p className="text-sm text-slate-500">{productsLabel(category.productCount)}</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label={`Renombrar ${category.name}`} onClick={() => setEditing({ id: category.id, name: category.name })}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="danger-ghost" size="icon" aria-label={`Eliminar ${category.name}`} onClick={() => setDeleting(category)}>
                    <Trash2 className="size-4" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          const category = deleting
          setDeleting(null)
          if (category)
            void removeCategory(company.id, category.id).then((ok) => {
              if (ok) reload()
            })
        }}
        title={`¿Eliminar la categoría ${deleting?.name ?? ''}?`}
        description={
          deleting && deleting.productCount > 0
            ? `${productsLabel(deleting.productCount)} ${deleting.productCount === 1 ? 'quedará' : 'quedarán'} sin categoría. Los productos no se borran.`
            : 'No tiene productos.'
        }
        confirmLabel="Eliminar categoría"
        destructive
      />
    </div>
  )
}
