import { useEffect, useState } from 'react'

type User = {
  id: string
  name: string
  age: number
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function UserCard({ userId }: { userId: string }) {
  const [data, setData] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setStatus('idle')
      setError(null)
      setData(null)
      return
    }
    let active = true
    setError(null)
    setData(null)
    setStatus('loading')

    const controller = new AbortController()

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (!active) return
        setData(data)
        setStatus('success')
      })
      .catch(err => {
        if (err.name === 'AbortError' || !active) return
        if (err instanceof Error) {
          setError(err.message)
        } else setError('Unknown error')

        setStatus('error')
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [userId])

  return (
    <div className='p-6 border border-black rounded'>
      <h1>User`s name: {data?.name ?? 'Guest'}</h1>
      <p>Status: {status}</p>
      {error && <p>Error: {error}</p>}
    </div>
  )
}
