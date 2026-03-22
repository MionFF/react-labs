import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { User } from './types'

class HttpError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

async function fetchUsers(shouldFail: boolean): Promise<User[]> {
  const url = shouldFail
    ? 'https://jsonplaceholder.typicode.com/unknown-endpoint'
    : 'https://jsonplaceholder.typicode.com/users'
  const res = await fetch(url)

  if (!res.ok) {
    throw new HttpError(`HTTP_ERROR: ${res.status}`, res.status)
  }

  return res.json()
}

function UsersDefaultsLab({ failMode }: { failMode: boolean }) {
  const { data, error, isPending, isError, isFetching, isStale } = useQuery({
    queryKey: ['users', failMode],
    queryFn: () => fetchUsers(failMode),
    staleTime: 5000,
    gcTime: 3000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      if (error instanceof HttpError) {
        if (error.status === 429) return failureCount < 2
        if (error.status >= 400 && error.status < 500) return false
      }

      return failureCount < 2
    },
  })

  if (isPending)
    return (
      <p role='status' aria-live='polite'>
        Loading...
      </p>
    )

  if (isFetching && !isPending)
    return (
      <p role='status' aria-live='polite'>
        Background updating...
      </p>
    )

  if (isError) return <p role='alert'>{error.message}</p>

  return (
    <div>
      <p role='status' aria-live='polite' className='my-2'>
        isFetching: {String(isFetching)}
      </p>
      <p role='status' aria-live='polite' className='my-2'>
        isStale: {String(isStale)}
      </p>
      <p role='status' aria-live='polite' className='my-2'>
        users count: {data.length}
      </p>

      <ul className='p-4 mt-4 border'>
        {data.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default function App() {
  const [toggleMounted, setToggleMounted] = useState(true)
  const [failMode, setFailMode] = useState(false)

  return (
    <>
      <button
        onClick={() => setToggleMounted(prev => !prev)}
        className='p-1 border rounded cursor-pointer my-2'
      >
        {toggleMounted ? 'Unmount component' : 'Mount component'}
      </button>
      <button
        onClick={() => setFailMode(prev => !prev)}
        className='p-1 border rounded cursor-pointer my-4'
      >
        Toggle fail mode
      </button>
      {toggleMounted && <UsersDefaultsLab failMode={failMode} />}
    </>
  )
}
