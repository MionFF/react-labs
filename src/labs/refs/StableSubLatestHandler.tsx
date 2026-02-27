import { useEffect, useRef, useState } from 'react'

export default function StableSubLatestHandlerLab() {
  const [n, setN] = useState(0)

  const latestHandlerRef = useRef<() => void | null>(null)
  latestHandlerRef.current = () => {
    console.log('resize sees n =', n)
  }

  useEffect(() => {
    console.log('effect setup (should be once)')
    function stableListener() {
      latestHandlerRef.current?.()
    }
    window.addEventListener('resize', stableListener)

    return () => {
      console.log('effect cleanup')
      window.removeEventListener('resize', stableListener)
    }
  }, [])

  return (
    <div className='p-6 font-sans space-y-3'>
      <div className='text-xl font-semibold'>Stable subscription / Latest handler</div>
      <div>n: {n}</div>

      <button className='rounded-xl border px-3 py-2' onClick={() => setN(x => x + 1)}>
        n++
      </button>

      <div className='text-sm text-gray-600'>
        Resize the window after changing n and watch the console.
      </div>
    </div>
  )
}
