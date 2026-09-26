import Button from './Button'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p>{message}</p>
      <Button onClick={onRetry}>Försök igen</Button>
    </div>
  )
}
