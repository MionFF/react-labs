import { Link, Outlet, useLoaderData, useNavigation } from 'react-router-dom'
import type { RootLoaderData } from './types'

export default function RootLayout() {
  const { appName, currentUser } = useLoaderData() as RootLoaderData
  const navigation = useNavigation()
  const loading = navigation.state === 'loading'

  return (
    <div className='grid grid-rows-[60px_1fr]'>
      <header className='p-4 border-b'>
        <nav className='flex justify-between'>
          <span className='font-semibold'>{appName}</span>
          <Link to={'catalog'}>Catalog</Link>
          <span className='font-semibold'>Hello, {currentUser ?? 'Guest'}!</span>
        </nav>
      </header>

      <main className='p-4'>
        <Outlet />
        {loading && (
          <p role='status' aria-live='polite'>
            Loading...
          </p>
        )}
      </main>
    </div>
  )
}
