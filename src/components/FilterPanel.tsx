import { useEffect, useRef, useState } from 'react'
import type { PolicyFilters, PolicyStatus } from '../types'

interface FilterPanelProps {
  products: string[]
  appliedFilters: PolicyFilters
  onApply: (filters: PolicyFilters) => void
  onClose: () => void
}

const statuses: { value: PolicyStatus; label: string }[] = [
  { value: 'Active', label: 'Aktiva försäkringar' },
  { value: 'Inactive', label: 'Avslutade försäkringar' },
]

function toggle<T,>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter(item => item !== value) : [...values, value]
}

export default function FilterPanel({ products, appliedFilters, onApply, onClose }: FilterPanelProps) {
  const [draft, setDraft] = useState(appliedFilters)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => { closeButton.current?.focus() }, [])

  return (
    <aside id="filter-panel" className="filter-panel" aria-label="Filtrera försäkringar"
      onKeyDown={event => { if (event.key === 'Escape') onClose() }}>
      <button ref={closeButton} type="button" className="filter-panel__close" onClick={onClose}
        aria-label="Stäng filterpanelen">×</button>
      <form onSubmit={event => { event.preventDefault(); onApply(draft) }}>
        <fieldset>
          <legend>Typ av försäkring</legend>
          {products.map(product => (
            <label key={product}>
              <input type="checkbox" checked={draft.products.includes(product)}
                onChange={() => setDraft(current => ({ ...current, products: toggle(current.products, product) }))} />
              {product}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Status</legend>
          {statuses.map(status => (
            <label key={status.value}>
              <input type="checkbox" checked={draft.statuses.includes(status.value)}
                onChange={() => setDraft(current => ({ ...current, statuses: toggle(current.statuses, status.value) }))} />
              {status.label}
            </label>
          ))}
        </fieldset>
        <button className="button button--primary" type="submit">Visa försäkringar</button>
      </form>
    </aside>
  )
}
