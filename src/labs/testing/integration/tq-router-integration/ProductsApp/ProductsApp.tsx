import { useQuery } from '@tanstack/react-query'
import { Link, Route, Routes, useSearchParams } from 'react-router-dom'

type Product = {
  id: number
  name: string
  category: 'books' | 'games'
}

type Props = {
  fetchProducts: (category: string) => Promise<Product[]>
}

function ProductsPage({ fetchProducts }: Props) {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'books'

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products', category],
    queryFn: () => fetchProducts(category),
    retry: false,
  })

  return (
    <section>
      <h1>Products</h1>

      <nav>
        <Link to='/products?category=books'>Books</Link>
        <Link to='/products?category=games'>Games</Link>
      </nav>

      {isLoading ? <p>Loading products...</p> : null}
      {isError ? <p>Failed to load products</p> : null}

      {!isLoading && !isError ? (
        <ul aria-label='Products list'>
          {data.map(product => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export default function ProductsApp({ fetchProducts }: Props) {
  return (
    <Routes>
      <Route path='/products' element={<ProductsPage fetchProducts={fetchProducts} />} />
    </Routes>
  )
}
