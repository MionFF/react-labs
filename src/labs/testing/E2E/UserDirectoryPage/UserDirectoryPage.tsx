import { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BrowserRouter, useSearchParams } from 'react-router-dom'
import { searchUsers } from './usersApi'

export function UserDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [input, setInput] = useState(initialQuery)

  const query = searchParams.get('q')?.trim() ?? ''

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users', query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 0,
    retry: false,
  })

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = input.trim()

    if (!trimmed) {
      setSearchParams({})
      return
    }

    setSearchParams({ q: trimmed })
  }

  function handleClear() {
    setInput('')
    setSearchParams({})
  }

  return (
    <section>
      <h1 className='font-semibold'>User Directory</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor='search-users'>Search users</label>
        <input
          id='search-users'
          value={input}
          onChange={e => setInput(e.target.value)}
          className='mx-2 outline-none ring-2'
        />
        <button type='submit' className='mx-1 p-1 border rounded cursor-pointer'>
          Search
        </button>
        <button type='button' onClick={handleClear} className='p-1 border rounded cursor-pointer'>
          Clear
        </button>
      </form>

      {!query ? <p>Enter a search query</p> : null}
      {query && isLoading ? <p>Loading users...</p> : null}
      {query && isError ? <p role='alert'>Failed to load users</p> : null}
      {query && !isLoading && !isError && data.length === 0 ? <p>No users found</p> : null}

      {query && !isLoading && !isError && data.length > 0 ? (
        <ul aria-label='Users list'>
          {data.map(user => (
            <li
              key={user.id}
              className='my-2 p-4 border rounded transition duration-200 ease hover:-translate-y-1 hover:bg-[#f3f3f3]'
            >
              {user.name}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

const queryClient = new QueryClient()

export default function UserDirectoryPageApp() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <QueryClientProvider client={queryClient}>
        <UserDirectoryPage />
      </QueryClientProvider>
    </BrowserRouter>
  )
}
