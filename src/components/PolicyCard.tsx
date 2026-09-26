import type { Policy } from '../types'

const priceFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

export default function PolicyCard({ policy }: { policy: Policy }) {
  const startDate = policy.policyStartDate.replaceAll('/', '-')

  return (
    <article className="policy-card" aria-labelledby={`policy-${policy.policyNumber}`}>
      <header className="policy-card__header">
        {policy.policyStatus === 'Inactive' && (
          <span className="policy-card__status">Din försäkring har avslutats</span>
        )}
        <h2 id={`policy-${policy.policyNumber}`}>{policy.productName}</h2>
        <p>{policy.policyDescription}</p>
      </header>
      <dl className="policy-card__details">
        <div><dt>Startdatum</dt><dd><time dateTime={startDate}>{startDate}</time></dd></div>
        <div><dt>Försäkringsnummer</dt><dd>{policy.policyNumber}</dd></div>
        <div><dt>Pris per månad</dt><dd>{priceFormatter.format(policy.yearlyPrice / 12)}</dd></div>
      </dl>
    </article>
  )
}
