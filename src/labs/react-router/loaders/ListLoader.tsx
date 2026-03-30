import { createBrowserRouter, Link, Outlet, RouterProvider, useLoaderData } from 'react-router-dom'

type Product = { id: string; name: string; price: number }

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

function ProductsPage() {
  const productList = useLoaderData() as Product[]

  return (
    <ul>
      {productList.map(p => (
        <li key={p.id}>
          <Link to={p.id} className='font-semibold underline'>
            {p.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function ProductDetailPage() {
  const product = useLoaderData() as Product

  return (
    <div className='p-4 border'>
      <h2 className='font-semibold'>{product.name}</h2>
      <p className='my-2'>Price: ${product.price}</p>
      <Link to={'/products'} className='p-1 border rounded cursor-pointer'>
        Back
      </Link>
    </div>
  )
}

function productsLoader() {
  return products
}

function productDetailLoader({ params }: { params: { productId?: string } }) {
  const product = products.find(p => p.id === params.productId)

  if (!product) throw new Error("Product doesn't exist")

  return product
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { path: 'products', Component: ProductsPage, loader: productsLoader },
      { path: 'products/:productId', Component: ProductDetailPage, loader: productDetailLoader },
    ],
  },
])

export default function ListLoaderApp() {
  return <RouterProvider router={router} />
}
