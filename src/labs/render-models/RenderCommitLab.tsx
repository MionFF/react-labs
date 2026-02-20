import { useEffect, useLayoutEffect, useState } from 'react'

export function RenderCommitLab() {
  const [count, setCount] = useState(0)

  console.log('1) render', { count })

  useLayoutEffect(() => {
    console.log('2) useLayoutEffect (after commit, before paint)', { count })
    return () => console.log('2-cleanup) layout cleanup', { count })
  }, [count])

  useEffect(() => {
    console.log('3) useEffect (after paint-ish)', { count })
    return () => console.log('3-cleanup) effect cleanup', { count })
  }, [count])

  return (
    <div style={{ padding: 16 }}>
      <h3>Render/Commit Lab</h3>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(c => c)}>set same</button>
      <p>count: {count}</p>
    </div>
  )
}
