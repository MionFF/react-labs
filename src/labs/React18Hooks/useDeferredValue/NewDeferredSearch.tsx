import { useDeferredValue, useId, useMemo, useState } from 'react'

type Item = {
  id: number
  title: string
}

function generateData(amount: number): Item[] {
  const result = []
  for (let i = 0; i < amount; i++) {
    const newItem = { id: i + 1, title: `Item ${i + 1}` }
    result.push(newItem)
  }
  return result
}

const data = generateData(5000)

export default function NewDeferredSearch() {
  const searchInput = useId()

  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  const visibleData = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return data.filter(item => item.title.toLowerCase().includes(q))
  }, [deferredQuery])

  return (
    <div className='p-6 border rounded'>
      <input
        type='text'
        name='search-input'
        id={searchInput}
        placeholder='Search'
        className='outline-none ring-2'
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <p>query: {query}</p>
      <p>deferredQuery: {deferredQuery}</p>

      {isStale && <p>Updating results...</p>}

      <ul className='p-6 my-3 border'>
        {visibleData.map(item => (
          <li
            key={item.id}
            className='p-6 my-2 border rounded transition duration-200 ease hover:-translate-y-1'
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
