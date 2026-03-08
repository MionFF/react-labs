import { useDeferredValue, useId, useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

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

const data = generateData(10000)

export default function VirtualizedSearch() {
  const searchInput = useId()
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  const visibleData = useMemo(() => {
    const value = deferredQuery.trim().toLowerCase()
    return data.filter(item => item.title.toLowerCase().includes(value))
  }, [deferredQuery])

  function highlightMatch(text: string, query: string) {
    if (!query) return text

    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const matchIndex = lowerText.indexOf(lowerQuery)

    if (matchIndex === -1) return text

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
    <div className='p-6'>
      <label htmlFor={searchInput}>Search: </label>
      <input
        type='text'
        name='search-input'
        id={searchInput}
        className='outline-none ring-2'
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {isStale && <p>Updating items...</p>}

      <div className='h-[400px] border-2 m-6'>
        <Virtuoso
          className='h-full'
          totalCount={visibleData.length}
          itemContent={index => {
            const item = visibleData[index]

            return (
              <div className='p-4 my-2 border rounded transition duration-200 ease hover:-translate-y-1'>
                <h2>{highlightMatch(item.title, deferredQuery)}</h2>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
