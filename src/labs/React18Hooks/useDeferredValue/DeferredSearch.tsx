import { useDeferredValue, useId, useMemo, useState } from 'react'

type Item = {
  id: number
  name: string
}

function generateData(amount: number) {
  const result: Item[] = []

  for (let i = 0; i < amount; i++) {
    const newItem = { id: i + 1, name: `Item ${i + 1}` }
    result.push(newItem)
  }

  return result
}

const data: Item[] = generateData(4000)

export default function DeferredSearch() {
  const inputId = useId()

  const [query, setQuery] = useState('')

  const deferredQuery = useDeferredValue(query)

  const isStale = query !== deferredQuery

  const visibleData = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()

    return data
      .filter(item => item.name.toLowerCase().includes(q))
      .concat(
        Array.from({ length: 8000 }, (_, i) => ({
          id: 5000 + i,
          name: 'extra ' + i,
        })),
      )
  }, [deferredQuery])

  return (
    <div className='p-6'>
      <input
        type='text'
        name='input'
        placeholder='Search...'
        id={inputId}
        value={query}
        onChange={e => setQuery(e.target.value)}
        className='outline-none ring-2 border'
      />

      <p className='my-2'>query: {query}</p>
      <p className='my-2'>deferredQuery: {deferredQuery}</p>

      {isStale && <p>Updating results...</p>}

      <ul className='my-4'>
        {visibleData.length ? (
          visibleData.map(item => (
            <li
              key={item.id}
              className='p-6 my-2 border rounded transition duration-200 ease hover:-translate-y-1'
            >
              {item.name}
            </li>
          ))
        ) : (
          <p>No matches found</p>
        )}
      </ul>
    </div>
  )
}
