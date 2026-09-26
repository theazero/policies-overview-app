interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.ceil(total / pageSize)
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <div className="pagination">
      {pageCount > 1 && (
        <nav aria-label="Sidnavigation för försäkringar" className="pagination__pages">
          <button type="button" aria-label="Föregående sida" disabled={page === 1}
            onClick={() => onPageChange(page - 1)}>‹</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(number => (
            <button type="button" key={number} aria-label={`Sida ${number}`}
              aria-current={page === number ? 'page' : undefined}
              onClick={() => onPageChange(number)}>{number}</button>
          ))}
          <button type="button" aria-label="Nästa sida" disabled={page === pageCount}
            onClick={() => onPageChange(page + 1)}>›</button>
        </nav>
      )}
      <p role="status">Visar {first}–{last} av {total} försäkringar</p>
    </div>
  )
}
