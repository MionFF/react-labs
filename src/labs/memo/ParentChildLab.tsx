import { useMemo, useState } from 'react'

function Child({ user }: { user: { name: string } }) {
  console.count('Child render')
  return <div>{user.name}</div>
}

export default function Parent() {
  console.count('Parent render')
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Denis')

  const user = useMemo(() => ({ name }), [name])

  return (
    <div>
      <button
        className='p-2 cursor-pointer border rounded mx-2'
        onClick={() => setCount(c => c + 1)}
      >
        count++
      </button>
      <button className='p-2 cursor-pointer border rounded mx-2' onClick={() => setName(n => n)}>
        setName(same)
      </button>
      <button className='p-2 cursor-pointer border rounded mx-2' onClick={() => setName('Alex')}>
        setName(Alex)
      </button>

      <div>count: {count}</div>
      <Child user={user} />
    </div>
  )
}
