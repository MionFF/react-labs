import { useEffect, useState } from 'react'

type User = {
  id: number
  name: string
}

type Props = {
  loadUsers: () => Promise<User[]>
}

export function UsersQueryScreen({ loadUsers }: Props) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [users, setUsers] = useState<User[]>([])

  async function run() {
    setStatus('loading')

    try {
      const data = await loadUsers()
      setUsers(data)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    run()
    // eslint-disable-next-line
  }, [])

  if (status === 'loading') {
    return <p>Loading users...</p>
  }

  if (status === 'error') {
    return (
      <div>
        <p>Failed to load users</p>
        <button onClick={run}>Retry</button>
      </div>
    )
  }

  return (
    <section>
      <h1>Users</h1>
      <ul aria-label='Users list'>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </section>
  )
}
