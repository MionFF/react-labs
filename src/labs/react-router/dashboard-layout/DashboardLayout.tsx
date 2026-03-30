import { createBrowserRouter, Link, Outlet, RouterProvider } from 'react-router-dom'

function RootLayout() {
  return (
    <div>
      <header className='p-4 m-4'>
        <Link to={'/'} className='p-1 m-2 border rounded cursor-pointer'>
          Home
        </Link>
        <Link to={'/dashboard'} className='p-1 m-2 border rounded cursor-pointer'>
          Dashboard
        </Link>
      </header>

      <main className='p-4 m-4'>
        <Outlet />
      </main>
    </div>
  )
}

function DashboardHomePage() {
  return (
    <div className='p-4 border'>
      <h1 className='font-semibold'>Dashboard Home</h1>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className='p-4 border'>
      <h1 className='font-semibold'>Settings</h1>
    </div>
  )
}

function DashboardLayout() {
  return (
    <div className='grid grid-cols-[240px_1fr]'>
      <aside className='min-h-screen p-4 border'>
        <h2 className='font-semibold'>Sidebar</h2>
        <nav className='flex flex-col'>
          <Link to={'/dashboard'} className='my-1 border-b w-fit'>
            Home
          </Link>
          <Link to={'/dashboard/settings'} className='my-1 border-b w-fit'>
            Settings
          </Link>
        </nav>
      </aside>

      <section className='min-h-screen p-4 border'>
        <Outlet />
      </section>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        path: 'dashboard',
        Component: DashboardLayout,
        children: [
          { index: true, Component: DashboardHomePage },
          { path: 'settings', Component: SettingsPage },
        ],
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
