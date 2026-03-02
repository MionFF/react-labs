type EmptyStateProps = { message: string }

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <li aria-live='polite' role='status'>
      {message}
    </li>
  )
}
