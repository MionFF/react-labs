import { useEffect, useRef, useState } from 'react'

type DataItem = {
  id: number
  title: string
}

const DATA: DataItem[] = [
  { id: 1, title: 'React useRef patterns' },
  { id: 2, title: 'useEffect dependencies and stale closures' },
  { id: 3, title: 'Debounce vs requestAnimationFrame throttle' },
  { id: 4, title: 'Outside click hook with refs' },
  { id: 5, title: 'Accessible modal basics (Esc, focus, overlay)' },
  { id: 6, title: 'TypeScript generics for custom hooks' },
]

function highlight(text: string, query: string) {
  const q = query.trim()
  if (!q) return text

  const lowerText = text.toLowerCase()
  const lowerQ = q.toLowerCase()
  const idx = lowerText.indexOf(lowerQ)

  if (idx === -1) return text

  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + q.length)
  const after = text.slice(idx + q.length)

  return (
    <>
      {before}
      <mark className='rounded bg-yellow-200 px-0.5'>{match}</mark>
      {after}
    </>
  )
}

export default function InteractiveSearchPanel() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const normalized = debouncedQuery.trim().toLowerCase()
  const results =
    normalized.length < 2 ? [] : DATA.filter(item => item.title.toLowerCase().includes(normalized))

  const inputRef = useRef<HTMLInputElement | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  function clearInput() {
    setQuery('')
    inputRef.current?.focus()
  }

  // Esc + scroll lock
  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // focus on open
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // debounce
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, 400)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [query])

  return (
    <div className='p-6 font-sans'>
      <button
        ref={triggerRef}
        className='rounded-xl border px-3 py-2 cursor-pointer'
        onClick={() => setOpen(o => !o)}
      >
        {open ? 'Close search' : 'Open search'}
      </button>

      {open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          {/* overlay */}
          <div className='absolute inset-0 bg-black/40' onClick={close} />

          {/* dialog */}
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='search-title'
            aria-describedby='search-desc'
            className='relative w-full max-w-md rounded-2xl border bg-white p-4 shadow-sm space-y-3'
          >
            <div id='search-title' className='font-semibold'>
              Search
            </div>

            <div className='flex gap-2'>
              <input
                ref={inputRef}
                className='flex-1 rounded-xl border px-3 py-2 outline-none focus:ring-2'
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder='Type to search...'
                aria-label='Search query'
              />
              <button
                className='rounded-xl border px-3 py-2 cursor-pointer'
                onClick={clearInput}
                type='button'
              >
                Clear
              </button>
            </div>

            <div id='search-desc' className='text-sm text-gray-600'>
              You are searching for:{' '}
              <span className='font-mono text-black'>{debouncedQuery || '—'}</span>
            </div>

            <div className='rounded-2xl border p-3'>
              {normalized.length < 2 ? (
                <div className='text-sm text-gray-600'>Type at least 2 characters.</div>
              ) : results.length === 0 ? (
                <div className='text-sm text-gray-600'>
                  No results for <span className='font-mono text-black'>{debouncedQuery}</span>
                </div>
              ) : (
                <ul className='space-y-2'>
                  {results.map(r => (
                    <li key={r.id} className='rounded-xl border px-3 py-2 text-sm'>
                      {highlight(r.title, debouncedQuery)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
