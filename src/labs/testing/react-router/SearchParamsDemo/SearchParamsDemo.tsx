import { Link, Route, Routes, useSearchParams } from 'react-router-dom'

function ProductsPage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'all'

  return (
    <section>
      <h1>Products</h1>
      <p>Category: {category}</p>

      <nav>
        <Link to='/products?category=books'>Books</Link>
        <Link to='/products?category=games'>Games</Link>
      </nav>
    </section>
  )
}

export default function SearchParamsDemo() {
  return (
    <Routes>
      <Route path='/products' element={<ProductsPage />} />
    </Routes>
  )
}
