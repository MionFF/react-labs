type EmptyStateProps = {
  message: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <li role='status' aria-live='polite'>
      {message}
    </li>
  )
}
