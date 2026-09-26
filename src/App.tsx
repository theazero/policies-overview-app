import { useEffect, useRef, useState } from 'react'
import FilterPanel from './components/FilterPanel'
import Pagination from './components/Pagination'
import PolicyList from './components/PolicyList'
import type { Policy, PolicyFilters } from './types'
import './App.css'
import './components.css'

const PAGE_SIZE = 5

function isPolicy(value: unknown): value is Policy {
  if (typeof value !== 'object' || value === null) return false
  const policy = value as Record<string, unknown>
  return typeof policy.policyNumber === 'number'
    && typeof policy.productName === 'string'
    && typeof policy.policyDescription === 'string'
    && (policy.policyStatus === 'Active' || policy.policyStatus === 'Inactive')
    && typeof policy.policyStartDate === 'string'
    && typeof policy.yearlyPrice === 'number'
}

function App() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [filters, setFilters] = useState<PolicyFilters>({ products: [], statuses: [] })
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const filterButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPolicies() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL
        if (!baseUrl) throw new Error('API-adress saknas')
        const response = await fetch(`${baseUrl.replace(/\/$/, '')}/policies/List`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Kunde inte hämta försäkringar')
        const data: unknown = await response.json()
        if (!Array.isArray(data) || !data.every(isPolicy)) throw new Error('Ogiltigt API-svar')
        if (!controller.signal.aborted) setPolicies(data)
      } catch {
        if (!controller.signal.aborted) setError(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadPolicies()
    return () => controller.abort()
  }, [attempt])

  const products = [...new Set(policies.map(policy => policy.productName))]
    .sort((a, b) => a.localeCompare(b, 'sv'))
  const filteredPolicies = policies.filter(policy =>
    (filters.products.length === 0 || filters.products.includes(policy.productName))
    && (filters.statuses.length === 0 || filters.statuses.includes(policy.policyStatus)),
  )
  const visiblePolicies = filteredPolicies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = filters.products.length > 0 || filters.statuses.length > 0

  function closeFilters() {
    setFilterOpen(false)
    filterButton.current?.focus()
  }

  return (
    <main className="overview">
      <h1>Mina försäkringar</h1>
      {loading ? <p className="overview__message" role="status">Hämtar dina försäkringar…</p>
        : error ? (
          <div className="overview__message" role="alert">
            <p>Det gick inte att hämta dina försäkringar. Försök igen.</p>
            <button type="button" className="button" onClick={() => {
              setLoading(true)
              setError(false)
              setAttempt(current => current + 1)
            }}>Försök igen</button>
          </div>
        ) : (
          <div className={`overview__layout${filterOpen ? ' overview__layout--with-filters' : ''}`}>
            <div className="overview__toolbar">
              <Pagination page={page} pageSize={PAGE_SIZE} total={filteredPolicies.length} onPageChange={setPage} />
              <button ref={filterButton} type="button" className="button" aria-expanded={filterOpen}
                aria-controls={filterOpen ? 'filter-panel' : undefined}
                onClick={() => setFilterOpen(current => !current)}>Filtrera</button>
            </div>
            {filterOpen && <FilterPanel products={products} appliedFilters={filters}
              onClose={closeFilters} onApply={nextFilters => {
                setFilters(nextFilters)
                setPage(1)
                closeFilters()
              }} />}
            <div className="overview__results">
              <PolicyList policies={visiblePolicies} hasFilters={hasFilters} />
            </div>
          </div>
        )}
    </main>
  )
}

export default App
