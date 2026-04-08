import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import TaskCreatePage from './TaskCreatePage'
import TaskListPage from './TaskListPage'

const queryClient = new QueryClient()

export function Layout() {
  const location = useLocation()

  return (
    <div>
      <nav className='flex w-fit gap-2'>
        <Link
          to='/tasks'
          className={`font-semibold ${location.pathname === '/tasks' && 'underline'}`}
        >
          Tasks
        </Link>
        <Link
          to='/tasks/new'
          className={`font-semibold ${location.pathname === '/tasks/new' && 'underline'}`}
        >
          New Task
        </Link>
      </nav>

      <Routes>
        <Route path='/tasks' element={<TaskListPage />} />
        <Route path='/tasks/new' element={<TaskCreatePage />} />
      </Routes>
    </div>
  )
}

export default function TaskApp() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <QueryClientProvider client={queryClient}>
        <Layout />
      </QueryClientProvider>
    </BrowserRouter>
  )
}
