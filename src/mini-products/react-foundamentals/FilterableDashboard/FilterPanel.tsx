type FilterPanelProps = {
  query: string
  onQueryChange: (next: string) => void
}

export default function FilterPanel({ query, onQueryChange }: FilterPanelProps) {
  console.count('FilterPanel')

  return (
    <div
      id='filter-session'
      className='flex flex-col p-4 bg-[var(--bg-secondary)] border border-[var(--border)]'
    >
      <label htmlFor='filter'>Filter: </label>
      <input
        type='search'
        name='filter'
        id='filter'
        placeholder='Type a name...'
        className='my-2 max-w-[200px] outline-none ring-2 ring-[var(--border)]'
        value={query}
        onChange={e => onQueryChange(e.target.value)}
      />
      <p>You're searching for: {query.trim() ? query : '...'}</p>
    </div>
  )
}
