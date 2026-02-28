import { useCallback, useMemo, useState } from 'react'
import type { User } from './types'
import FilterPanel from './FilterPanel'
import UsersList from './UsersList'
import EmptyState from './EmptyState'

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

  const visibleUsers = useMemo(() => {
    return sortedUsers.map(u => ({
      ...u,
      pinned: pinnedIds.has(u.id),
    }))
  }, [pinnedIds, sortedUsers])

  const emptyMessage = users.length ? 'No results found' : 'No users found'

  console.count('Dashboard')

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] text-[var(--color)]'>
      <FilterPanel query={query} onQueryChange={setQuery} />

      {/* <UsersList users={visibleUsers} onTogglePin={togglePin} /> */}
      {users.length ? (
        visibleUsers.length ? (
          <UsersList users={visibleUsers} onTogglePin={togglePin} emptyMessage={emptyMessage} />
        ) : (
          <EmptyState message='No results found' />
        )
      ) : (
        <EmptyState message='No users found' />
      )}
    </div>
  )
}
