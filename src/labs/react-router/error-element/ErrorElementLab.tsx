import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useLoaderData,
  useRouteError,
} from 'react-router-dom'

type Product = {
  id: string
  name: string
  price: number
}

const products: Product[] = [
  { id: '1', name: 'iPhone', price: 999 },
  { id: '2', name: 'Galaxy', price: 899 },
]

function productsLoader() {
  return products
}

function productDetailLoader({ params }: { params: { productId?: string } }): Product {
  const product = products.find(p => p.id === params.productId)

  if (!product) throw new Error('Product not found')

  return product
}

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
  const productsList = useLoaderData() as Product[]

  return (
    <>
      <ul>
        {productsList.map(p => (
          <li key={p.id}>
            <Link to={p.id} className='my-2 font-semibold underline'>
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link to={'999'} className='my-2 font-semibold underline'>
        Missing product
      </Link>
    </>
  )
}

function ProductDetailPage() {
  const product = useLoaderData() as Product

  return (
    <div className='my-2 p-4 border rounded'>
      <h2 className='font-semibold'>{product.name}</h2>
      <p className='my-2'>Price: ${product.price}</p>
      <Link to={'/products'} className='p-1 border rounded cursor-pointer'>
        Back
      </Link>
    </div>
  )
}

function ProductErrorPage() {
  const error = useRouteError() as Error

  return (
    <>
      <h1 className='font-semibold'>Product error</h1>
      <p role='alert' className='my-2'>
        {error.message}
      </p>
      <Link to={'/products'} className='p-1 border rounded cursor-pointer'>
        Back to products
      </Link>
    </>
  )
}

function RootErrorPage() {
  const error = useRouteError() as Error

  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <h1 className='mb-2 text-2xl'>Something went wrong...</h1>
      <p className='mb-4'>{error.message}</p>
      <Link to={'/'} className='py-1 px-4 border rounded cursor-pointer'>
        Back
      </Link>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    errorElement: <RootErrorPage />,
    children: [
      { path: 'products', loader: productsLoader, Component: ProductsPage },
      {
        path: 'products/:productId',
        loader: productDetailLoader,
        Component: ProductDetailPage,
        errorElement: <ProductErrorPage />,
      },
    ],
  },
])

export default function ErrorElementLab() {
  return <RouterProvider router={router} />
}
