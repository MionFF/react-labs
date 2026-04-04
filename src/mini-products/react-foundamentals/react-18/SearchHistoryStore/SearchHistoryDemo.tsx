import { useId, useState, useSyncExternalStore } from 'react'
import { getSnapshot, subscribe, addQuery, clearHistory } from './searchHistoryStore'

export default function SearchHistoryDemo() {
  const [query, setQuery] = useState('')
  const history = useSyncExternalStore(subscribe, getSnapshot)
  const inputId = useId()

  function onSubmit(e: React.SubmitEvent<HTMLButtonElement>, query: string) {
    e.preventDefault()
    addQuery(query)
    setQuery('')
  }

  return (
    <form className='p-6'>
      <label htmlFor={inputId}>Add query: </label>
      <input
        type='text'
        id={inputId}
        placeholder='Type...'
        className='outline-none ring-2'
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <button
        type='submit'
        onSubmit={e => onSubmit(e, query)}
        className='p-1 ml-2 border rounded cursor-pointer transition duration-200 ease hover:-translate-y-1'
      >
        Add
      </button>

      <button
        type='button'
        onClick={clearHistory}
        className='p-1 ml-2 border rounded cursor-pointer transition duration-200 ease hover:-translate-y-1'
      >
        Clear
      </button>

      <ul className='p-4 mt-6 border rounded'>
        {history.length ? (
          history.map(item => (
            <li
              key={item}
              className='p-3 my-2 border rounded transition duration-200 ease hover:-translate-y-1'
            >
              {item}
            </li>
          ))
        ) : (
          <li>History is empty.</li>
        )}
      </ul>
    </form>
  )
}
