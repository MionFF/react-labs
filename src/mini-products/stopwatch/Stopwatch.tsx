import { useEffect, useRef, useState } from 'react'

export default function Stopwatch() {
  const [ticking, setTicking] = useState(false)
  const [count, setCount] = useState(0)

  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)

  function start() {
    setTicking(true)
  }

  function stop() {
    setTicking(false)
  }

  function reset() {
    setTicking(false)
    setCount(0)
  }

  console.log('1) render')

  useEffect(() => {
    if (!ticking || intervalId.current !== null) return
    intervalId.current = setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)
    console.log('2) useEffect')

    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current)
      }
      intervalId.current = null
      console.log('3) cleanup')
    }
  }, [ticking])

  return (
    <>
      <h1>Stopwatch: {count}</h1>
      <button onClick={start} disabled={ticking}>
        Start
      </button>{' '}
      <button onClick={stop} disabled={!ticking}>
        Stop
      </button>
      <button onClick={reset}>Reset</button>
    </>
  )
}
