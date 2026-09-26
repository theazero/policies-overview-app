import type { Policy } from '../types'
import PolicyCard from './PolicyCard'

interface PolicyListProps {
  policies: Policy[]
  hasFilters: boolean
}

export default function PolicyList({ policies, hasFilters }: PolicyListProps) {
  if (policies.length === 0) {
    return <p className="empty-state" role="status">{hasFilters
      ? 'Inga försäkringar matchar dina filter. Prova att ändra dina val.'
      : 'Du har inga försäkringar att visa.'}</p>
  }

  return (
    <ul className="policy-list" aria-label="Dina försäkringar">
      {policies.map(policy => (
        <li key={policy.policyNumber}><PolicyCard policy={policy} /></li>
      ))}
    </ul>
  )
}
