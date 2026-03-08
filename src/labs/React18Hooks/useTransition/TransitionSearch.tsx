import { useId, useState, useTransition } from 'react'

type Item = {
  id: number
  title: string
}

function generateData(amount: number): Item[] {
  const result = []
  for (let i = 0; i < amount; i++) {
    const newItem = { id: i + 1, title: `Item ${i + 1}` }
    result.push(newItem)
  }
  return result
}

const data = generateData(5000)

export default function TransitionSearch() {
  const searchInput = useId()
  const [query, setQuery] = useState('')
  const [list, setList] = useState<Item[]>(data)
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    setQuery(value)

    startTransition(() => {
      const q = value.trim().toLowerCase()
      const filtered = data.filter(item => item.title.toLowerCase().includes(q))
      setList(filtered)
    })
  }

  return (
    <div className='p-6 border rounded'>
      <input
        type='text'
        name='search-input'
        id={searchInput}
        placeholder='Search'
        className='outline-none ring-2'
        value={query}
        onChange={handleSearch}
      />

      {isPending && <p>Filtering...</p>}

      <ul className='p-6 my-3 border'>
        {list.map(item => (
          <li
            key={item.id}
            className='p-6 my-2 border rounded transition duration-200 ease hover:-translate-y-1'
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
