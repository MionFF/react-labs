import { useId, useState, useTransition } from 'react'

type Item = {
  id: number
  name: string
}

function generateData(amount: number) {
  const result: Item[] = []

  for (let i = 0; i < amount; i++) {
    const newItem = { id: i + 1, name: `Item ${i + 1}` }
    result.push(newItem)
  }

  return result
}

const data: Item[] = generateData(4000)

export default function SearchList() {
  const inputId = useId()
  const [query, setQuery] = useState('')
  const [list, setList] = useState<Item[]>([])
  const [, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    setQuery(value)

    startTransition(() => {
      for (let i = 0; i < 20000000; i++) {
        // const x = Math.sqrt(i) * Math.sin(i) // Required for test (has error)!
      }

      const q = value.trim().toLowerCase()
      const filtered = data.filter(item => item.name.toLowerCase().includes(q))
      setList(filtered)
    })
  }

  return (
    <div className='p-6'>
      <input
        type='text'
        name='input'
        placeholder='Search...'
        id={inputId}
        value={query}
        onChange={handleChange}
        className='outline-none ring-2 border'
      />

      {/* {isPending && <p>Filtering...</p>} */}

      <ul className='my-4'>
        {list.length ? (
          list.map(item => (
            <li
              key={item.id}
              className='p-6 my-2 border rounded transition duration-200 ease hover:-translate-y-1'
            >
              {item.name}
            </li>
          ))
        ) : (
          <p>No matches found</p>
        )}
      </ul>
    </div>
  )
}
