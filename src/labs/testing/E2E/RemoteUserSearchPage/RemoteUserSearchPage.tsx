import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

type User = {
  id: number
  firstName: string
  lastName: string
}

export function RemoteUserSearchPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [users, setUsers] = useState<User[]>([])

  async function handleSearch() {
    const trimmed = query.trim()

    if (!trimmed) {
      setUsers([])
      setStatus('idle')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(trimmed)}`)

      if (!res.ok) {
        throw new Error('Request failed')
      }

      const data = await res.json()
      setUsers(data.users ?? [])
      setStatus('success')
    } catch {
      setUsers([])
      setStatus('error')
    }
  }

  return (
    <section>
      <h1 className='font-semibold'>Remote User Search</h1>

      <label htmlFor='remote-search'>Search users</label>
      <input
        id='remote-search'
        value={query}
        onChange={e => setQuery(e.target.value)}
        className='mx-2 outline-none ring-2'
      />

      <button onClick={handleSearch} className='p-1 border rounded cursor-pointer'>
        Search
      </button>

      {status === 'idle' ? <p>Enter a search query</p> : null}
      {status === 'loading' ? <p>Loading users...</p> : null}
      {status === 'error' ? <p role='alert'>Failed to load users</p> : null}
      {status === 'success' && users.length === 0 ? <p>No users found</p> : null}

      {status === 'success' && users.length > 0 ? (
        <ul aria-label='Users list' className='mt-4'>
          {users.map(user => (
            <li
              key={user.id}
              className='my-3 p-4 border rounded transition duration-200 hover:-translate-y-1'
            >
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export default function RemoteUserSearchPageApp() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path='/remote-users' Component={RemoteUserSearchPage} />
      </Routes>
    </BrowserRouter>
  )
}
