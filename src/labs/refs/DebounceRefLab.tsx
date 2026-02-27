import { useEffect, useRef, useState } from 'react'

export default function DebounceRefLab() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    // 1) при каждом query сбрасываем прошлый таймер
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // 2) ставим новый таймер
    timeoutRef.current = setTimeout(() => {
      setDebounced(query)
    }, 400)

    // 3) cleanup на unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [query])

  return (
    <div className='p-4 font-sans space-y-3'>
      <h3 className='text-lg font-semibold'>Debounce with useRef</h3>

      <label className='block space-y-1'>
        <span className='text-sm text-gray-600'>Search</span>
        <input
          className='w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2'
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='type fast...'
        />
      </label>

      <div className='rounded-xl border border-gray-200 p-3'>
        <div className='text-sm text-gray-600'>raw:</div>
        <div className='font-mono'>{query || '—'}</div>

        <div className='mt-2 text-sm text-gray-600'>debounced (400ms):</div>
        <div className='font-mono'>{debounced || '—'}</div>
      </div>
    </div>
  )
}
