import { useEffect, useState } from 'react'

let globalCounter = 0

export function BadSideEffectLab() {
  const [x, setX] = useState(0)

  // BAD: side effect in render
  globalCounter++
  console.log('render: globalCounter++', { globalCounter, x })

  useEffect(() => {
    console.log('effect: subscribe/start', { x })
    return () => console.log('effect: cleanup/stop', { x })
  }, [x])

  return (
    <div style={{ padding: 16 }}>
      <h3>Bad Side Effect Lab</h3>
      <button onClick={() => setX(v => v + 1)}>re-render</button>
      <p>x: {x}</p>
      <p>globalCounter: {globalCounter}</p>
    </div>
  )
}
