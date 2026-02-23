import { useEffect, useState } from 'react'

export default function StaleStateInEffect() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count)
    }, 1000)
    return () => clearInterval(id)
  }, [count]) // с пустым deps count обновляться не будет!

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button
        className='p-3 cursor-pointer bg-indigo-400 text-white border border-black rounded'
        onClick={() => setCount(prev => prev - 1)}
        disabled={count <= 0}
      >
        -
      </button>{' '}
      <button
        className='p-3 cursor-pointer bg-indigo-400 text-white border border-black rounded'
        onClick={() => setCount(prev => prev + 1)}
      >
        +
      </button>
    </div>
  )
}
