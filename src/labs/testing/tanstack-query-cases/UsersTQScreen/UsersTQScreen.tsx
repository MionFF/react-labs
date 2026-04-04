import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from './usersApi'

export default function UsersTQScreen() {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    retry: false,
  })

  if (isLoading || isFetching)
    return (
      <p role='status' aria-live='polite'>
        Loading users...
      </p>
    )
  if (isError)
    return (
      <div>
        <p role='alert' className='text-red-600'>
          Failed to load users
        </p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    )
  if (!data?.length) return <p>No users found</p>

  return (
    <section>
      <h1>Users</h1>
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
    </section>
  )
}
