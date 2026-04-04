import { useEffect, useState } from 'react'

type User = {
  id: number
  name: string
}

type Props = {
  loadUsers: () => Promise<User[]>
}

export function AsyncUsers({ loadUsers }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('loading')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    let ignore = false

    async function run() {
      try {
        setStatus('loading')
        const data = await loadUsers()

        if (ignore) return

        setUsers(data)
        setStatus('success')
      } catch {
        if (ignore) return
        setStatus('error')
      }
    }

    run()

    return () => {
      ignore = true
    }
  }, [loadUsers])

  if (status === 'loading') {
    return <p>Loading users...</p>
  }

  if (status === 'error') {
    return <p>Failed to load users</p>
  }

  return (
    <ul aria-label='Users list'>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
