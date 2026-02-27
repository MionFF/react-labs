import { useState } from 'react'
import { usePrevious } from './hooks/usePrevious'

export default function PrevValueLab() {
  const [count, setCount] = useState(0)
  const prev = usePrevious(count)

  return (
    <div className='p-6 font-sans space-y-3'>
      <div className='text-xl font-semibold'>Previous Value Lab</div>

      <div className='rounded-2xl border p-4 space-y-1'>
        <div>current: {count}</div>
        <div>previous: {prev === undefined ? '---' : prev}</div>
        <div>delta: {prev === undefined ? '---' : count - prev}</div>
      </div>

      <button className='rounded-xl border px-3 py-2' onClick={() => setCount(c => c + 1)}>
        +1
      </button>
      <button className='rounded-xl border px-3 py-2' onClick={() => setCount(c => c - 1)}>
        -1
      </button>
    </div>
  )
}
