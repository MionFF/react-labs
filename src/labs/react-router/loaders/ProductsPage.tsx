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
  return (
    <ul>
      {products.map(p => (
        <li
          key={p.id}
          className='my-2 p-4 border rounded transition duration-200 ease hover:-translate-y-1 hover:bg-[#f3f3f3]'
        >
          <Link to={p.id} className='font-semibold underline my-1'>
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
    <div>
      <h2 className='font-semibold'>{product.name}</h2>
      <p className='my-1'>Price: ${product.price}</p>
      <Link to={'/products'} className='p-1 border rounded cursor-pointer'>
        Back
      </Link>
    </div>
  )
}

async function productLoader({ params }: { params: { productId?: string } }) {
  const product = products.find(p => p.id === params.productId)

  if (!product) throw new Error("Product doesn't exist")

  return product
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { path: 'products', Component: ProductsPage },
      { path: 'products/:productId', Component: ProductDetailPage, loader: productLoader },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
