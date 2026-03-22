import { useQuery } from '@tanstack/react-query'
import type { User } from './types'

async function fetchUsers() {
  console.log('FETCH_USERS: request started')

  const res = await fetch('https://jsonplaceholder.typicode.com/users')

  if (!res.ok) {
    throw new Error(`HTTP_ERROR: ${res.status}`)
  }

  const data = await res.json()

  console.log('FETCH_USERS: request finished')
  return data
}

export default function UsersPage() {
  const { data, error, isPending, isError, isSuccess, isFetching, isStale } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 3000,
    refetchOnWindowFocus: true,
  })

  if (isPending) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p role='alert'>{error.message}</p>
  }

  if (isSuccess && data.length === 0) {
    return <p>No users found</p>
  }

  return (
    <section>
      <p>isFetching: {String(isFetching)}</p>
      <p>isStale: {String(isStale)}</p>

      {isFetching && <p>Background updating...</p>}

      <ul>
        {data.map((user: User) => (
          <li key={user.id}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </section>
  )
}
