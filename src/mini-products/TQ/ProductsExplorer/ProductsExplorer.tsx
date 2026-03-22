import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

type Product = {
  id: number
  title: string
  price: number
  category: string
}

type Category = {
  slug: string
  name: string
  url: string
}

type SortBy = 'title' | 'price-asc' | 'price-desc'

async function fetchProducts({
  search,
  category,
}: {
  search: string
  category: string
}): Promise<{ products: Product[] }> {
  let url = 'https://dummyjson.com/products'

  if (search.trim()) {
    url = `https://dummyjson.com/products/search?q=${search}`
  } else if (category !== 'all') {
    url = `https://dummyjson.com/products/category/${category}`
  }

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`HTTP_ERROR: ${res.status}`)
  }

  return res.json()
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('https://dummyjson.com/products/categories')

  if (!res.ok) {
    throw new Error(`HTTP_ERROR: ${res.status}`)
  }

  return res.json()
}

export default function ProductsExplorer() {
  const [searchDraft, setSearchDraft] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<SortBy>('title')

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const { data: products = [] } = useQuery({
    queryKey: ['products', { search: appliedSearch, category: selectedCategory }],
    queryFn: () =>
      fetchProducts({
        search: appliedSearch,
        category: selectedCategory,
      }),
    select: data => data.products,
  })

  const sortedProducts = useMemo(() => {
    return products.toSorted((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'price-asc') return a.price - b.price
      return b.price - a.price
    })
  }, [products, sortBy])

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setAppliedSearch(searchDraft)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={searchDraft}
          onChange={e => setSearchDraft(e.target.value)}
          className='mx-2 outline-none ring-2'
        />
        <button type='submit' className='p-1 border rounded cursor-pointer'>
          Search
        </button>
      </form>

      <select
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
        className='p-1 border rounded cursor-pointer'
      >
        <option value='all'>all</option>

        {categories.map(c => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value as SortBy)}
        className='p-1 border rounded cursor-pointer'
      >
        <option value='title'>title</option>
        <option value='price-asc'>price asc</option>
        <option value='price-desc'>price desc</option>
      </select>

      <ul>
        {sortedProducts.map(p => (
          <li key={p.id}>
            {p.title} — ${p.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
