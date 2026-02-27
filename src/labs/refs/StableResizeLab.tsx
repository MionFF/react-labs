import { useEffect, useRef, useState } from 'react'

export default function StableResizeLab() {
  const [n, setN] = useState(0)

  const handlerRef = useRef<() => void>(null)

  // всегда храним актуальную логику
  handlerRef.current = () => {
    console.log('resize with n =', n)
  }

  useEffect(() => {
    const stableListener = () => {
      handlerRef.current?.()
    }

    window.addEventListener('resize', stableListener)

    return () => {
      window.removeEventListener('resize', stableListener)
    }
  }, []) // ← внимание

  return (
    <div className='p-4 space-y-3 font-sans'>
      <button className='rounded-xl border px-3 py-2' onClick={() => setN(x => x + 1)}>
        rerender: {n}
      </button>
    </div>
  )
}
