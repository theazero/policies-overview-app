import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import Checkbox from './Checkbox'
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
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    const update = () => setMobile(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!mobile) {
      closeButton.current?.focus()
      return
    }
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    element?.showModal()
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    return () => {
      element?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [mobile])

  const content = (
    <>
      {mobile && <h2 className="filter-panel__title">Filtrera försäkringar</h2>}
      <button ref={closeButton} type="button" className="filter-panel__close" onClick={onClose}
        aria-label="Stäng filterpanelen">×</button>
      <form onSubmit={event => { event.preventDefault(); onApply(draft) }}>
        <div className="filter-panel__options">
        <fieldset>
          <legend>Typ av försäkring</legend>
          {products.map(product => (
            <Checkbox key={product} label={product} checked={draft.products.includes(product)}
              onChange={() => setDraft(current => ({ ...current, products: toggle(current.products, product) }))} />
          ))}
        </fieldset>
        <fieldset>
          <legend>Status</legend>
          {statuses.map(status => (
            <Checkbox key={status.value} label={status.label} checked={draft.statuses.includes(status.value)}
              onChange={() => setDraft(current => ({ ...current, statuses: toggle(current.statuses, status.value) }))} />
          ))}
        </fieldset>
        </div>
        <div className="filter-panel__actions">
          <Button variant="primary" type="submit">Visa försäkringar</Button>
        </div>
      </form>
    </>
  )

  return mobile ? (
    <dialog ref={dialog} id="filter-panel" className="filter-panel filter-panel--mobile"
      aria-label="Filtrera försäkringar"
      onCancel={event => { event.preventDefault(); onClose() }}>
      {content}
    </dialog>
  ) : (
    <aside id="filter-panel" className="filter-panel" aria-label="Filtrera försäkringar"
      onKeyDown={event => { if (event.key === 'Escape') onClose() }}>
      {content}
    </aside>
  )
}
