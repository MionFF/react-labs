import { useSearchParams } from 'react-router-dom'
import type { Category, SortOption } from './types'

export function useCatalogSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''
  const sort = (searchParams.get('sort') || 'name') as SortOption
  const category = (searchParams.get('category') || 'all') as Category

  function handleQueryChange(value: string) {
    setSearchParams(prev => {
      const nextParams = new URLSearchParams(prev)

      if (value.trim()) {
        nextParams.set('q', value)
      } else {
        nextParams.delete('q')
      }

      return nextParams
    })
  }

  function handleSortChange(value: SortOption) {
    setSearchParams(prev => {
      const nextParams = new URLSearchParams(prev)

      if (value === 'name') {
        nextParams.delete('sort')
      } else {
        nextParams.set('sort', value)
      }

      return nextParams
    })
  }

  function handleCategoryChange(value: Category) {
    setSearchParams(prev => {
      const nextParams = new URLSearchParams(prev)

      if (value === 'all') {
        nextParams.delete('category')
      } else {
        nextParams.set('category', value)
      }

      return nextParams
    })
  }

  return {
    q,
    sort,
    category,
    handleQueryChange,
    handleSortChange,
    handleCategoryChange,
  }
}
