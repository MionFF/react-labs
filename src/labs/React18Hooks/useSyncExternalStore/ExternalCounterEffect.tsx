import { useEffect, useState } from 'react'
import { decrement, getSnapshot, increment, subscribe } from './counterStore'

export default function ExternalCounterEffect() {
  const [count, setCount] = useState(getSnapshot())

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setCount(getSnapshot())
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const btnClasses =
    'p-2 border rounded cursor-pointer transition duration-200 ease hover:-translate-y-1'

  return (
    <div className='p-6 mt-8'>
      <h1 className='mb-3 font-bold'>Counter (useEffect): {count}</h1>
      <button onClick={decrement} className={btnClasses}>
        -
      </button>{' '}
      <button onClick={increment} className={btnClasses}>
        +
      </button>
    </div>
  )
}
