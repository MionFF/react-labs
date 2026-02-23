import { useEffect, useState } from 'react'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query) return

    const controller = new AbortController()
    console.log(query)
    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => setResults(data))

    return () => controller.abort()
  }, [query])

  return (
    <div>
      <label>
        Search
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <ul>
        {results.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  )
}
