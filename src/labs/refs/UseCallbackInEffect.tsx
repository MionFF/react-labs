import { useCallback, useEffect, useState } from 'react'

export default function UseCallbackInEffect() {
  const [n, setN] = useState(0)

  console.log('render')

  const handleResize = useCallback(() => {
    console.log('Current n:', n)
  }, [n])

  useEffect(() => {
    const controller = new AbortController()
    console.log('setup')

    window.addEventListener('resize', handleResize, { signal: controller.signal })
    return () => {
      controller.abort()
      console.log('cleanup')
    }
  }, [handleResize])

  return (
    <div>
      <h1>Count: {n}</h1>
      <button onClick={() => setN(prev => prev + 1)} className='p-1 border rounded cursor-pointer'>
        +
      </button>
    </div>
  )
}
