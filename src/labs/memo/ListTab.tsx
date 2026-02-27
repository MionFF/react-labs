import React, { useCallback, useMemo, useState } from 'react'

type TodoItem = {
  id: number
  title: string
  done: boolean
}

type TodoProps = {
  item: TodoItem
  onToggle: (id: number) => void
}

const Item = React.memo(function Item({ item, onToggle }: TodoProps) {
  console.count('Item render ' + item.id)
  return (
    <li className='flex items-center gap-2'>
      <input type='checkbox' checked={item.done} onChange={() => onToggle(item.id)} />
      <span>{item.title}</span>
    </li>
  )
})

export default function ListLab() {
  console.count('ListLab render')

  const [count, setCount] = useState(0)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<TodoItem[]>([
    { id: 1, title: 'Learn memo', done: false },
    { id: 2, title: 'Fix rerenders', done: false },
    { id: 3, title: 'Ship mini-product', done: false },
  ])

  const toggle = useCallback((id: number) => {
    setItems(prev => prev.map(x => (x.id === id ? { ...x, done: !x.done } : x)))
  }, [])

  const filteredItems = useMemo(() => {
    console.count('filter memo')
    return items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()))
  }, [items, query])

  return (
    <div className='p-6 font-sans space-y-3'>
      <div className='text-xl font-semibold'>useMemo + memo lab</div>

      <button className='rounded-xl border px-3 py-2' onClick={() => setCount(c => c + 1)}>
        count++ ({count})
      </button>

      <input
        className='w-full max-w-md rounded-xl border px-3 py-2'
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder='Filter items...'
        aria-label='Filter items'
      />

      <ul className='space-y-2'>
        {filteredItems.map((item: TodoItem) => (
          <Item key={item.id} item={item} onToggle={toggle} />
        ))}
      </ul>
    </div>
  )
}
