import { memo, useCallback, useState } from 'react'

type Item = { id: number; title: string; pinned: boolean }
type ListItemProps = Item & { onPinned: (id: number) => void }

function generateItems(amount: number) {
  const result = []

  for (let i = 0; i < amount; i++) {
    const user = {
      id: i + 1,
      title: `Item ${i + 1}`,
      pinned: false,
    }
    result.push(user)
  }

  return result
}

const ListItem = memo(({ id, title, pinned, onPinned }: ListItemProps) => {
  console.count('Item render ' + id)

  return (
    <li className='my-2'>
      {title}{' '}
      <button onClick={() => onPinned(id)} className='p-1 border rounded cursor-pointer'>
        {pinned ? 'Unpin' : 'Pin'}
      </button>
    </li>
  )
})

export default function RenderProbe() {
  const [items, setItems] = useState<Item[]>(generateItems(200))

  const handleTogglePin = useCallback((id: number) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, pinned: !i.pinned } : i)))
  }, [])

  const pinned = items.filter(i => i.pinned)
  const rest = items.filter(i => !i.pinned)
  const sortedPinnedItems = [...pinned, ...rest]

  console.count('Parent render')

  return (
    <ul className='p-6 border'>
      {sortedPinnedItems.map(i => (
        <ListItem
          key={i.id}
          id={i.id}
          title={i.title}
          pinned={i.pinned}
          onPinned={handleTogglePin}
        />
      ))}
    </ul>
  )
}
