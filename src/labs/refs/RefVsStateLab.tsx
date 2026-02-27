import { useRef, useState } from 'react'

export default function RefVsStateLab() {
  const renderCount = useRef(0)
  renderCount.current += 1

  const clicksRef = useRef(0)
  const [clicksState, setClicksState] = useState(0)

  const incRef = () => {
    clicksRef.current += 1
    console.log('incRef -> clicksRef.current =', clicksRef.current)
  }

  const incState = () => {
    setClicksState(s => s + 1)
  }

  const forceRerender = () => {
    setClicksState(s => s) // намеренно "то же значение"
  }

  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6 }}>
      <h3>Ref vs State Lab</h3>
      <p>renderCount: {renderCount.current}</p>
      <p>ref: {clicksRef.current}</p>
      <p>state: {clicksState}</p>
      <button onClick={incRef} className='p-1 border rounded cursor-pointer'>
        +ref
      </button>{' '}
      <button onClick={incState} className='p-1 border rounded cursor-pointer'>
        +state
      </button>{' '}
      <button onClick={forceRerender} className='p-1 border rounded cursor-pointer'>
        force (set same state)
      </button>
    </div>
  )
}
