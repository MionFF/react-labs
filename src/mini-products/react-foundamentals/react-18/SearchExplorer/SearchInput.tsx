import { useId } from 'react'

type SearchInputProps = {
  query: string
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SearchInput({ query, onQueryChange }: SearchInputProps) {
  const searchInput = useId()

  return (
    <div>
      <label htmlFor={searchInput}>Search:</label>
      <input
        type='text'
        name='search-input'
        id={searchInput}
        placeholder='Type...'
        className='ml-2 outline-none ring-2'
        value={query}
        onChange={onQueryChange}
      />
    </div>
  )
}
