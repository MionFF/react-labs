import { createBrowserRouter, Link, Outlet, RouterProvider } from 'react-router-dom'
import EffectProductPage from './EffectProductPage'
import LoaderProductPage from './LoaderProductPage'

function RootLayout() {
  return (
    <div>
      <header className='p-4 m-4 border'>
        <nav>
          <Link to={'/effect-product/1'} className='p-1 border rounded cursor-pointer'>
            Effect
          </Link>
          <Link to={'/loader-product/1'} className='p-1 border rounded cursor-pointer'>
            Loader
          </Link>
        </nav>
      </header>

      <main className='p-4 m-4 border'>
        <Outlet />
      </main>
    </div>
  )
}

async function productLoader() {
  const res = await fetch('https://dummyjson.com/products/1')
  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)
  return res.json()
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        path: '/effect-product/1',
        Component: EffectProductPage,
      },
      {
        path: '/loader-product/1',
        Component: LoaderProductPage,
        loader: productLoader,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
