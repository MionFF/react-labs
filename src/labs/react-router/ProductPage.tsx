import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom'

async function productLoader({ params }: { params: { productId: number } }) {
  const res = await fetch(`/api/products/${params.productId}`)

  if (!res.ok) {
    throw new Error('Failed to load product')
  }

  return res.json()
}

function ProductPage() {
  const product = useLoaderData()

  return (
    <section>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
    </section>
  )
}

const router = createBrowserRouter([
  {
    path: '/products/:productId',
    loader: productLoader,
    Component: ProductPage,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
