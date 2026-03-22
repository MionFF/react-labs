import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { User } from './types'

type SortBy = 'name' | 'email'

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users')

  if (!res.ok) {
    throw new Error(`HTTP_ERROR: ${res.status}`)
  }

  return res.json()
}

function highlightMatch(text: string, query: string) {
  const q = query.trim()

  if (!q) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const matchIndex = lowerText.indexOf(lowerQuery)

  if (matchIndex === -1) return text

  const before = text.slice(0, matchIndex)
  const match = text.slice(matchIndex, matchIndex + query.length)
  const after = text.slice(matchIndex + query.length)

  return (
    <>
      {before}
      <mark>{match}</mark>
      {after}
    </>
  )
}

export default function UsersFilteredList() {
  const [searchInput, setSearchInput] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('name')

  const { data, error, isPending, isError, isSuccess } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    select: users =>
      users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
  })

  const visibleData = useMemo(() => {
    if (!data) return []

    const q = searchInput.trim().toLowerCase()

    const filtered = data.filter(user => {
      return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
    })

    return filtered.toSorted((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }

      return a.email.localeCompare(b.email)
    })
  }, [data, searchInput, sortBy])

  if (isPending) {
    return (
      <p role='status' aria-live='polite'>
        Loading...
      </p>
    )
  }

  if (isError) {
    return <p role='alert'>{error.message}</p>
  }

  if (isSuccess && data.length === 0) {
    return (
      <p role='status' aria-live='polite'>
        No users found
      </p>
    )
  }

  return (
    <div>
      <label htmlFor='search-input'>Search:</label>
      <input
        id='search-input'
        type='text'
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        className='mx-2 outline-none ring-2'
      />

      <button
        onClick={() => setSortBy(prev => (prev === 'email' ? 'name' : 'email'))}
        className='p-1 border rounded cursor-pointer'
      >
        Sort by {sortBy}
      </button>

      {visibleData.length > 0 ? (
        <ul className='my-4'>
          {visibleData.map(user => (
            <li key={user.id}>
              {highlightMatch(user.name, searchInput)} — {highlightMatch(user.email, searchInput)}
            </li>
          ))}
        </ul>
      ) : (
        <p role='status' aria-live='polite'>
          No users matched your search
        </p>
      )}

      <p>total users from query: {data.length}</p>
      <p>visible users after filtering: {visibleData.length}</p>
    </div>
  )
}
