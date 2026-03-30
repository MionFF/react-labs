import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useFetcher,
  useLoaderData,
} from 'react-router-dom'

type Product = {
  id: string
  name: string
  price: number
}

type ProductPreview = {
  id: string
  price: number
}

const products: Product[] = [
  { id: '1', name: 'iPhone', price: 999 },
  { id: '2', name: 'Galaxy', price: 899 },
  { id: '3', name: 'MacBook', price: 1999 },
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

function productsLoader() {
  return products
}

function productPreviewLoader({ params }: { params: { productId?: string } }): ProductPreview {
  const product = products.find(p => p.id === params.productId)

  if (!product) {
    throw new Error("Product doesn't exist")
  }

  return {
    id: product.id,
    price: product.price,
  }
}

function ProductPreviewButton({ product }: { product: Product }) {
  const fetcher = useFetcher() as ReturnType<typeof useFetcher> & {
    data?: ProductPreview
  }

  return (
    <div className='mt-2'>
      <button
        type='button'
        onClick={() => fetcher.load(`/products/${product.id}/preview`)}
        className='rounded border p-1 cursor-pointer'
      >
        Preview price
      </button>

      {fetcher.state === 'loading' ? <p>Loading...</p> : null}

      {fetcher.data ? <p>Price preview: ${fetcher.data.price}</p> : null}
    </div>
  )
}

function ProductsPage() {
  const productList = useLoaderData() as Product[]

  return (
    <ul className='space-y-3'>
      {productList.map(product => (
        <li key={product.id} className='rounded border p-4'>
          <h2 className='font-semibold'>{product.name}</h2>
          <ProductPreviewButton product={product} />
        </li>
      ))}
    </ul>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { path: 'products', Component: ProductsPage, loader: productsLoader },
      { path: 'products/:productId/preview', loader: productPreviewLoader },
    ],
  },
])

export default function ProductsWithFetcherApp() {
  return <RouterProvider router={router} />
}
