import { useRef, useState } from 'react'
import Button from './components/Button'
import ErrorState from './components/ErrorState'
import FilterPanel from './components/FilterPanel'
import Pagination from './components/Pagination'
import PolicyList from './components/PolicyList'
import { usePolicies } from './hooks/usePolicies'
import type { PolicyFilters } from './types'
import './App.css'
import './components.css'

const PAGE_SIZE = 5

function App() {
  const { policies, loading, error, retry } = usePolicies()
  const [filters, setFilters] = useState<PolicyFilters>({ products: [], statuses: [] })
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const filterButton = useRef<HTMLButtonElement>(null)

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
          <ErrorState message="Det gick inte att hämta dina försäkringar. Försök igen." onRetry={retry} />
        ) : (
          <div className={`overview__layout${filterOpen ? ' overview__layout--with-filters' : ''}`}>
            <div className="overview__toolbar">
              <Pagination page={page} pageSize={PAGE_SIZE} total={filteredPolicies.length} onPageChange={setPage} />
              <Button ref={filterButton} aria-expanded={filterOpen}
                aria-controls={filterOpen ? 'filter-panel' : undefined}
                onClick={() => setFilterOpen(current => !current)}>Filtrera</Button>
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
