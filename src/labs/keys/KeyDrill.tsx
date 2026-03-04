import { useState, useRef, type ChangeEvent } from 'react'

type TodoItem = { id: number }

type ItemProps = { label: string }

function Item({ label }: ItemProps) {
  const [local, setLocal] = useState('') // локальный state внутри item
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className='m-2'>
      <div className='opacity-70'>{label}</div>

      <input
        ref={inputRef}
        placeholder='Type here...'
        className='outline-none ring-2'
        value={local}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setLocal(e.target.value)}
      />
    </div>
  )
}

function nextId(items: TodoItem[]): number {
  return Math.max(0, ...items.map(i => i.id)) + 1
}

export default function KeyDrill() {
  const [items, setItems] = useState<TodoItem[]>([{ id: 1 }, { id: 2 }, { id: 3 }])

  function addToStart(): void {
    setItems(prev => [{ id: nextId(prev) }, ...prev])
  }

  return (
    <div className='p-4'>
      <button onClick={addToStart} className='p-2 border rounded'>
        Add to start
      </button>

      <ul className='mt-3'>
        {items.map((item, index) => (
          <li key={index}>
            <Item label={`item id=${item.id} (key=index)`} />
          </li>
        ))}
      </ul>
    </div>
  )
}
