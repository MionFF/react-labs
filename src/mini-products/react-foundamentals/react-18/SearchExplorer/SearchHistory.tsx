import { clearHistory, getSnapshot, subscribe } from './store/searchHistoryStore'
import { useSyncExternalStore } from 'react'

export default function SearchHistory() {
  const history = useSyncExternalStore(subscribe, getSnapshot)

  return (
    <section className='p-6 border'>
      <h2 className='font-bold'>Search history</h2>

      <button
        onClick={clearHistory}
        className='p-1 my-3 border rounded cursor-pointer transition duration-200 ease hover:-translate-y-1 hover:bg-[#444]'
      >
        Clear history
      </button>

      <ul className='p-4 mt-4 border w-fit'>
        {history.length ? (
          history.map(item => (
            <li key={item} className='my-1'>
              {item}
            </li>
          ))
        ) : (
          <li role='status' aria-live='polite'>
            History is empty.
          </li>
        )}
      </ul>
    </section>
  )
}
