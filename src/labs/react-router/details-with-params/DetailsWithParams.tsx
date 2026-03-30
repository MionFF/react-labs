import { createBrowserRouter, Link, Outlet, RouterProvider, useParams } from 'react-router-dom'

type User = {
  id: string
  name: string
}

const linkStyleClasses = 'mx-1 underline'

const users: User[] = [
  { id: '1', name: 'Alex' },
  { id: '2', name: 'Maria' },
  { id: '3', name: 'John' },
]

function RootLayout() {
  return (
    <div className='grid grid-rows-[60px_1fr]'>
      <header className='p-4 border-b'>
        <nav>
          <Link to={'/users'} className={linkStyleClasses}>
            Users
          </Link>
        </nav>
      </header>

      <main className='p-4'>
        <Outlet />
      </main>
    </div>
  )
}

function UsersPage() {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} className='my-3'>
          <span className='mx-2 font-semibold'>{user.name}</span>
          <Link to={user.id} className='p-1 border rounded cursor-pointer'>
            Details
          </Link>
        </li>
      ))}
    </ul>
  )
}

function UserDetailPage() {
  const { userId } = useParams()
  const user = users.find(user => user.id === userId)

  if (!user)
    return (
      <>
        <h2 className='mb-3 font-semibold' role='alert'>
          User not found
        </h2>

        <Link to={'/users'} className='p-1 border rounded cursor-pointer'>
          Back to users
        </Link>
      </>
    )

  return (
    <div className='p-4 border'>
      <h2 className='mb-2 font-semibold'>User detail</h2>
      <p>ID: {user.id}</p>
      <p className='mb-3'>Name: {user.name}</p>
      <Link to={'/users'} className='p-1 border rounded cursor-pointer'>
        Back
      </Link>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        path: 'users',
        Component: UsersPage,
      },
      {
        path: 'users/:userId',
        Component: UserDetailPage,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
