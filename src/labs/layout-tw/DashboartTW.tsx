import ScreenShell from '../../shared/components/ScreenShell'
import Card from '../../shared/components/Card'

export default function DashboardTW() {
  return (
    <ScreenShell className='grid grid-cols-[240px_1fr] grid-rows-[auto_1fr_auto] gap-2'>
      <header className='col-span-2 p-6 border border-[var(--border)]'>Header</header>

      <aside className='col-span-1 border border-[var(--border)] p-3'>
        <ul className='flex flex-col gap-2'>
          <li className='cursor-pointer hover:-translate-y-1 transition duration-300 ease'>
            Dashboard
          </li>
          <li className='cursor-pointer hover:-translate-y-1 transition duration-300 ease'>
            Projects
          </li>
          <li className='cursor-pointer hover:-translate-y-1 transition duration-300 ease'>
            Settings
          </li>
        </ul>
      </aside>

      <main className='col-span-1 border border-[var(--border)] p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
          {Array.from({ length: 6 }, (_, i) => (
            <Card
              key={i}
              className='flex justify-between cursor-pointer hover:-translate-y-1 hover:opacity-90'
            >
              {i + 1}
              <button className='bg-indigo-800 p-1 rounded cursor-pointer hover:scale-105 transition duration-200 ease focus-visible:outline-none focus-visible:ring-2'>
                Click
              </button>
            </Card>
          ))}
        </div>
      </main>

      <footer className='col-span-2 p-6 border border-[var(--border)]'>Footer</footer>
    </ScreenShell>
  )
}
