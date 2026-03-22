import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { User } from './types'

class HttpError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

async function fetchUsers(shouldFail: boolean) {
  console.log('FETCH start')

  const url = shouldFail
    ? 'https://jsonplaceholder.typicode.com/unknown-endpoint'
    : 'https://jsonplaceholder.typicode.com/users'

  const res = await fetch(url)

  if (!res.ok) {
    throw new HttpError(`HTTP_ERROR: ${res.status}`, res.status)
  }

  const data = await res.json()
  console.log('FETCH success')
  return data
}

function UsersPanel({ shouldFail }: { shouldFail: boolean }) {
  const { data, error, isPending, isError, isFetching } = useQuery({
    queryKey: ['users', shouldFail],
    queryFn: () => fetchUsers(shouldFail),
    staleTime: 5000,
    gcTime: 3000,
    retry: (failureCount, error) => {
      if (error instanceof HttpError && error.status === 404) {
        return false
      }

      return failureCount < 2
    },
  })

  if (isPending) return <p>Loading...</p>
  if (isError) return <p role='alert'>{error.message}</p>

  return (
    <section>
      <p>isFetching: {String(isFetching)}</p>
      <ul>
        {data.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </section>
  )
}

export default function App() {
  const [visible, setVisible] = useState(true)
  const [shouldFail, setShouldFail] = useState(false)

  return (
    <section>
      <button onClick={() => setVisible(v => !v)} className='p-1 border rounded cursor-pointer'>
        Toggle panel
      </button>

      <button onClick={() => setShouldFail(v => !v)} className='p-1 border rounded cursor-pointer'>
        Toggle fail mode
      </button>

      {visible && <UsersPanel shouldFail={shouldFail} />}
    </section>
  )
}
