import { decrement, getSnapshot, increment, subscribe } from './counterStore'
import { useSyncExternalStore } from 'react'

export default function ExternalCounter() {
  const count = useSyncExternalStore(subscribe, getSnapshot)

  const btnClasses =
    'p-2 border rounded cursor-pointer transition duration-200 ease hover:-translate-y-1'

  return (
    <div className='p-6'>
      <h1 className='mb-3 font-bold'>Counter: {count}</h1>
      <button onClick={decrement} className={btnClasses}>
        -
      </button>{' '}
      <button onClick={increment} className={btnClasses}>
        +
      </button>
    </div>
  )
}
