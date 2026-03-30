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

  const q = searchParams.get('q') ?? ''
  const sort = (searchParams.get('sort') ?? 'name') as SortBy

  const visibleProducts = useMemo(() => {
    const query = q.trim().toLowerCase()

    const filtered = products.filter(product => product.name.toLowerCase().includes(query))

    const sorted = [...filtered]

    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'name':
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return sorted
  }, [q, sort])

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

  return (
    <section>
      <div className='mb-4 flex gap-4'>
        <div>
          <label htmlFor='search-input' className='mr-2'>
            Search:
          </label>
          <input
            id='search-input'
            type='text'
            className='border px-2 py-1'
            value={q}
            onChange={e => handleQueryChange(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor='sort-select' className='mr-2'>
            Sort:
          </label>
          <select
            id='sort-select'
            className='border px-2 py-1'
            value={sort}
            onChange={e => handleSortChange(e.target.value as SortBy)}
          >
            <option value='name'>Name</option>
            <option value='price-asc'>Price ↑</option>
            <option value='price-desc'>Price ↓</option>
          </select>
        </div>
      </div>

      <ul>
        {visibleProducts.map(product => (
          <li key={product.id} className='my-2 border p-4'>
            <h2 className='font-semibold'>{product.name}</h2>
            <p>Price: {product.price}</p>
            <p>Category: {product.category}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [{ path: 'products', Component: ProductsPage }],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
