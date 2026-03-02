import { useId } from 'react'
import type { SortBy } from './types'

type NotesToolbarProps = {
  query: string
  onQueryChange(next: string): void
  sortBy: SortBy
  onSortByChange(next: SortBy): void
  showPinnedOnly: boolean
  onShowPinnedOnlyChange(next: boolean): void
}

export default function NotesToolbar({
  query,
  onQueryChange,
  sortBy,
  onSortByChange,
  showPinnedOnly,
  onShowPinnedOnlyChange,
}: NotesToolbarProps) {
  const searchId = useId()
  const sortId = useId()
  const pinnedId = useId()

  return (
    <div className='flex gap-2 p-6 border border-[#777]'>
      <label htmlFor={searchId}>Search: </label>
      <input
        type='text'
        name='search-input'
        id={searchId}
        placeholder='Search notes...'
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        className='outline-none ring-2 ring-[#777]'
      />

      <select
        className='border border-[#777] cursor-pointer'
        name='sort-select'
        id={sortId}
        value={sortBy}
        onChange={e => onSortByChange(e.target.value as SortBy)}
      >
        <option value='title'>Title</option>
        <option value='updated'>Updated</option>
      </select>

      <label htmlFor={pinnedId}>Show pinned only</label>
      <input
        type='checkbox'
        name='show-pinned-only'
        id={pinnedId}
        checked={showPinnedOnly}
        onChange={e => onShowPinnedOnlyChange(e.target.checked)}
      />
    </div>
  )
}
