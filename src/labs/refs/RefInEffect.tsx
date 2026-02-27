import { useEffect, useRef, useState } from 'react'

export default function RefInEffect() {
  const [n, setN] = useState(0)
  const ref = useRef<() => void>(null)

  console.log('render')

  ref.current = () => {
    console.log('Current n:', n)
  }

  useEffect(() => {
    const controller = new AbortController()
    function handleResize() {
      ref?.current?.()
    }

    console.log('setup')

    window.addEventListener('resize', handleResize, { signal: controller.signal })
    return () => {
      controller.abort()
      console.log('cleanup')
    }
  }, [])

  return (
    <div>
      <h1>Count: {n}</h1>
      <button onClick={() => setN(prev => prev + 1)} className='p-1 border rounded cursor-pointer'>
        +
      </button>
    </div>
  )
}
