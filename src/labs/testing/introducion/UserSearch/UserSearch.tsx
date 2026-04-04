import { useMemo, useState } from 'react'

type Props = {
  users: string[]
}

export function UserSearch({ users }: Props) {
  const [query, setQuery] = useState('')

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(user => user.toLowerCase().includes(q))
  }, [users, query])

  return (
    <section>
      <h1>User Search</h1>

      <label htmlFor='search'>Search users</label>
      <input id='search' value={query} onChange={e => setQuery(e.target.value)} />

      {filteredUsers.length > 0 ? (
        <ul aria-label='Users list'>
          {filteredUsers.map(user => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      ) : (
        <p>No matches</p>
      )}
    </section>
  )
}
