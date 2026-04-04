import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import type { SearchItem } from './types'
import SearchInput from './SearchInput'
import ResultsList from './ResultsList'
import SearchHistory from './SearchHistory'
import { fetchSearchItems } from './api'
import { addQuery } from './store/searchHistoryStore'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const DELAY = 800

  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    setError(null)
    setIsLoading(true)

    let ignore = false

    async function load() {
      try {
        const res = await fetchSearchItems(false)
        if (!ignore) setData(res)
      } catch (error) {
        if (error instanceof Error) {
          if (!ignore) {
            setData([])
            setError(error.message)
          }
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    const normalized = query.trim()

    if (!normalized) return

    const timeoutId = setTimeout(() => {
      if (normalized.length < 2) return
      addQuery(normalized)
    }, DELAY)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [query])

  function onQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
  }

  const visibleData = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return data.filter(item => item.title.toLowerCase().includes(q))
  }, [deferredQuery, data])

  const emptyMessage = !data.length ? 'No data yet.' : 'No matches.'

  return (
    <div className='min-h-screen p-6 bg-[#333] text-white border-[#777]'>
      <SearchInput query={query} onQueryChange={onQueryChange} />
      <ResultsList
        data={visibleData}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
        error={error}
        query={deferredQuery}
      />
      <SearchHistory />
    </div>
  )
}
