type EmptyStateProps = {
  message: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <p role='status' aria-live='polite'>
      {message}
    </p>
  )
}
