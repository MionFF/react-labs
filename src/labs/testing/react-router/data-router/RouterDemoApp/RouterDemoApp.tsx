import { Outlet, Link, useParams } from 'react-router-dom'

// eslint-disable-next-line
function RootLayout() {
  return (
    <div>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/users/42'>User 42</Link>
      </nav>
      <Outlet />
    </div>
  )
}

// eslint-disable-next-line
function HomePage() {
  return <h1>Home Page</h1>
}
// eslint-disable-next-line
function UserPage() {
  const { id } = useParams()
  return <h1>User page: {id}</h1>
}

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'users/:id',
        element: <UserPage />,
      },
    ],
  },
]
