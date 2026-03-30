import { useMemo } from 'react'
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useSearchParams,
} from 'react-router-dom'

type Product = {
  id: string
  name: string
  category: string
  price: number
}

type SortBy = 'name' | 'price-asc' | 'price-desc'

type Category = 'all' | 'phones' | 'laptops'

const products: Product[] = [
  { id: '1', name: 'iPhone', category: 'phones', price: 999 },
  { id: '2', name: 'Galaxy', category: 'phones', price: 899 },
  { id: '3', name: 'MacBook', category: 'laptops', price: 1999 },
  { id: '4', name: 'ThinkPad', category: 'laptops', price: 1499 },
]

function RootLayout() {
  return (
    <div className='grid grid-rows-[60px_1fr]'>
      <header className='p-4 border-b'>
        <nav>
          <Link to='/products' className='underline'>
            Products
          </Link>
        </nav>
      </header>

      <main className='p-4'>
        <Outlet />
      </main>
    </div>
  )
}

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''
  const sort = (searchParams.get('sort') ?? 'name') as SortBy
  const category = (searchParams.get('category') ?? 'all') as Category

  const visibleProducts = useMemo(() => {
    const query = q.trim().toLowerCase()
    const filtered = products.filter(p => p.name.toLowerCase().includes(query))

    const sorted = [...filtered]

    switch (sort) {
      case 'price-asc': {
        sorted.sort((a, b) => a.price - b.price)
        break
      }
      case 'price-desc': {
        sorted.sort((a, b) => b.price - a.price)
        break
      }
      default: {
        sorted.sort((a, b) => a.name.localeCompare(b.name))
      }
    }

    let result

    switch (category) {
      case 'phones': {
        result = sorted.filter(p => p.category === 'phones')
        break
      }
      case 'laptops': {
        result = sorted.filter(p => p.category === 'laptops')
        break
      }
      default: {
        result = sorted
      }
    }

    return result
  }, [q, sort, category])

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

  function handleSortChange(value: SortBy) {
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

  return (
    <div>
      <label htmlFor='search-input'>Search:</label>
      <input
        type='text'
        id='search-input'
        className='mx-2 outline-none ring-2'
        value={q}
        onChange={e => handleQueryChange(e.target.value)}
      />

      <label htmlFor='sort-select'>Sort by:</label>
      <select
        id='sort-select'
        className='p-1 mx-2 border rounded cursor-pointer'
        value={sort}
        onChange={e => handleSortChange(e.target.value as SortBy)}
      >
        <option value='name'>Name</option>
        <option value='price-asc'>Price ↑</option>
        <option value='price-desc'>Price ↓</option>
      </select>

      <label htmlFor='category-select'>Category:</label>
      <select
        id='category-select'
        className='p-1 mx-2 border rounded cursor-pointer'
        value={category}
        onChange={e => handleCategoryChange(e.target.value as Category)}
      >
        <option value='all'>All</option>
        <option value='phones'>Phones</option>
        <option value='laptops'>Laptops</option>
      </select>

      <ul>
        {visibleProducts.length ? (
          visibleProducts.map(p => (
            <li
              key={p.id}
              className='p-4 my-2 border rounded transition duration-200 ease hover:-translate-y-1 hover:bg-[#f3f3f3]'
            >
              <h2 className='font-semibold'>{p.name}</h2>
              <p>Price: {p.price}</p>
              <p>Category: {p.category}</p>
            </li>
          ))
        ) : (
          <p>No matches.</p>
        )}
      </ul>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        path: 'products',
        Component: ProductsPage,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
