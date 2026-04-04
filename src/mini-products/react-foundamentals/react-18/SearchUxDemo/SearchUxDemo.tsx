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

export default function SearchUxDemo() {
  const searchInput = useId()
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  const visibleItems = useMemo(() => {
    const value = deferredQuery.trim().toLowerCase()
    return data.filter(item => item.title.toLowerCase().includes(value))
  }, [deferredQuery])

  function highlightMatch(text: string, query: string) {
    if (!query) return text

    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const matchIndex = lowerText.indexOf(lowerQuery)

    const before = text.slice(0, matchIndex)
    const match = text.slice(matchIndex, matchIndex + query.length)
    const after = text.slice(matchIndex + query.length)

    return (
      <>
        {before}
        <mark>{match}</mark>
        {after}
      </>
    )
  }

  return (
    <div className='p-6 border rounded'>
      <label htmlFor={searchInput}>Search: </label>
      <input
        type='text'
        name='search-input'
        id={searchInput}
        className='outline-none ring-2'
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {isStale && <p>Updating results...</p>}

      <ul className='p-6 my-2 border rounded'>
        {visibleItems.length ? (
          visibleItems.map(item => (
            <li
              key={item.id}
              className='p-4 my-2 border rounded transition duration-200 ease hover:-translate-y-1'
            >
              {highlightMatch(item.title, deferredQuery)}
            </li>
          ))
        ) : (
          <li>No matches found</li>
        )}
      </ul>
    </div>
  )
}
