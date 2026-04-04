import { useState } from 'react'

type User = {
  id: number
  name: string
  active: boolean
}

type Props = {
  users: User[]
  onToggleActive: (id: number, nextValue: boolean) => Promise<void>
}

export default function UserStatusTable({ users, onToggleActive }: Props) {
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  async function handleToggle(user: User) {
    setError('')
    setPendingId(user.id)

    try {
      await onToggleActive(user.id, !user.active)
    } catch {
      setError(`Failed to update ${user.name}`)
    } finally {
      setPendingId(null)
    }
  }

  return (
    <section>
      <h1>Users</h1>

      {error ? <p role='alert'>{error}</p> : null}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => {
            const isPending = pendingId === user.id

            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => handleToggle(user)} disabled={isPending}>
                    {isPending ? 'Saving...' : user.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
