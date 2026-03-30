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
  favorite: boolean
}

let products: Product[] = [
  { id: '1', name: 'iPhone', favorite: false },
  { id: '2', name: 'Galaxy', favorite: true },
  { id: '3', name: 'MacBook', favorite: false },
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

async function favoriteAction({ request }: { request: Request }) {
  const formData = await request.formData()

  const productId = String(formData.get('productId'))
  const nextFavorite = String(formData.get('favorite')) === 'true'

  products = products.map(product =>
    product.id === productId ? { ...product, favorite: nextFavorite } : product,
  )

  return { ok: true }
}

function FavoriteButton({ product }: { product: Product }) {
  const fetcher = useFetcher() as ReturnType<typeof useFetcher>

  const optimisticFavorite = fetcher.formData
    ? fetcher.formData.get('favorite') === 'true'
    : product.favorite

  return (
    <fetcher.Form method='post' action='/products/toggle-favorite'>
      <input type='hidden' name='productId' value={product.id} />
      <input type='hidden' name='favorite' value={String(!product.favorite)} />

      <button type='submit'>{optimisticFavorite ? '★ Favorited' : '☆ Favorite'}</button>
    </fetcher.Form>
  )
}

function ProductsPage() {
  const productsList = useLoaderData() as Product[]

  return (
    <ul>
      {productsList.map(p => (
        <li key={p.id}>
          <h2>{p.name}</h2>
          <FavoriteButton product={p} />
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
      { path: 'products', loader: productsLoader, Component: ProductsPage },
      { path: 'products/toggle-favorite', action: favoriteAction },
    ],
  },
])

export default function ProductsPageWithOptimisticUIApp() {
  return <RouterProvider router={router} />
}
