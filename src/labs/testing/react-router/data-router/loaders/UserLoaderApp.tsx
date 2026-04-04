import { useLoaderData } from 'react-router-dom'

type User = {
  id: string
  name: string
}

export async function userLoader({ params }: { params: { id?: string } }) {
  return {
    id: params.id ?? 'unknown',
    name: params.id === '42' ? 'Denis' : 'Guest',
  } satisfies User
}

// eslint-disable-next-line
function UserPage() {
  const user = useLoaderData() as User

  return (
    <section>
      <h1>User Profile</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
    </section>
  )
}

export const loaderRoutes = [
  {
    path: '/users/:id',
    loader: userLoader,
    element: <UserPage />,
  },
]
