import { useCallback, useMemo, useState } from 'react'
import { UserCard } from './UserCard'
import type { User } from './types'

function generateUsers(count: number): User[] {
  const result = []

  for (let i = 0; i < count; i++) {
    const user = {
      id: i + 1,
      name: `User ${i + 1}`,
      score: Math.floor(Math.random() * 1000),
    }
    result.push(user)
  }

  return result
}

export default function Dashboard() {
  const [query, setQuery] = useState('')
  const [pinnedIds, setPinnedIds] = useState<Set<number>>(() => new Set())
  const [users] = useState(() => generateUsers(2000))

  const togglePin = useCallback((id: number) => {
    setPinnedIds(prev => {
      const next = new Set(prev)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }, [])

  const sortedUsers = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(q))
    const top10 = filteredUsers.toSorted((a, b) => b.score - a.score).slice(0, 10)
    const pinnedTop = top10.filter(u => pinnedIds.has(u.id))
    const rest = top10.filter(u => !pinnedIds.has(u.id))
    return [...pinnedTop, ...rest]
  }, [users, query, pinnedIds])

  console.count('Dashboard')

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] text-[var(--color)]'>
      <div
        id='input-session'
        className='flex flex-col p-4 bg-[var(--bg-secondary)] border border-[var(--border)]'
      >
        <label htmlFor='filter'>Filter: </label>
        <input
          type='search'
          name='filter'
          id='filter'
          placeholder='Type a name...'
          className='my-2 outline-none ring-2 ring-[var(--border)]'
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <p>You're searching for: {query.trim() ? query : '...'}</p>
      </div>

      <ul id='list' className='p-4 bg-[var(--bg-primary)] border border-[var(--border)]'>
        {users.length ? (
          sortedUsers.length ? (
            sortedUsers.map(user => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                score={user.score}
                pinned={pinnedIds.has(user.id)}
                onTogglePin={togglePin}
              />
            ))
          ) : (
            <li role='status' aria-live='polite'>
              No results found
            </li>
          )
        ) : (
          <li role='status' aria-live='polite'>
            No users found
          </li>
        )}
      </ul>
    </div>
  )
}
