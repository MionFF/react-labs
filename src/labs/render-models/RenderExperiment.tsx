import { useEffect, useState } from 'react'

export default function RenderExperiment() {
  const [count, setCount] = useState(0)

  console.log('Render phase')

  useEffect(() => {
    console.log('Effect executed')

    return () => {
      console.log('Cleanup')
    }
  }, [count])

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}
