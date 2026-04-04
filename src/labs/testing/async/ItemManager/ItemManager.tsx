import { useState } from 'react'

type Item = {
  id: number
  title: string
}

type Props = {
  items: Item[]
  onDelete: (id: number) => Promise<void>
}

export default function ItemManager({ items, onDelete }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  async function handleDelete(id: number) {
    setError('')
    setDeletingId(id)

    try {
      await onDelete(id)
    } catch {
      setError('Failed to delete item')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section>
      <h1>Item Manager</h1>

      {error ? <p role='alert'>{error}</p> : null}

      <ul aria-label='Items list'>
        {items.map(item => {
          const isDeleting = deletingId === item.id

          return (
            <li key={item.id}>
              <span>{item.title}</span>
              <button onClick={() => handleDelete(item.id)} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
