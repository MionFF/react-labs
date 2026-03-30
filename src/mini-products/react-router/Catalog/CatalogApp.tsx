import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'
import type { AddCategory, CatalogActionData, Product } from './types'
import RootLayout from './RootLayout'
import CatalogPage from './CatalogPage'
import ProductDetailPage from './ProductDetailPage'
import DetailErrorPage from './DetailErrorPage'

let products: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro',
    category: 'phones',
    price: 999,
    favorite: true,
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24',
    category: 'phones',
    price: 850,
    favorite: false,
  },
  {
    id: 'p3',
    name: 'Google Pixel 8',
    category: 'phones',
    price: 699,
    favorite: true,
  },
  {
    id: 'l1',
    name: 'MacBook Air M3',
    category: 'laptops',
    price: 1099,
    favorite: true,
  },
  {
    id: 'l2',
    name: 'ASUS ROG Zephyrus G14',
    category: 'laptops',
    price: 1599,
    favorite: false,
  },
  {
    id: 'l3',
    name: 'Dell XPS 13',
    category: 'laptops',
    price: 1250,
    favorite: false,
  },
]

function rootLoader() {
  return {
    appName: 'Catalog Admin',
    currentUser: 'Denis',
  }
}

function productsLoader() {
  return products
}

function productDetailLoader({ params }: { params: { productId?: string } }) {
  const product = products.find(p => p.id === params.productId)

  if (!product) throw new Error('Product not found')

  return product
}

async function catalogAction({
  request,
}: {
  request: Request
}): Promise<CatalogActionData | undefined> {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const price = formData.get('price')
  const category = formData.get('category') as AddCategory

  const formattedPrice = Number(price)

  console.log(name, formattedPrice, category)

  if (!name || !formattedPrice || (category !== 'phones' && category !== 'laptops'))
    return { error: 'All fields are required!' }

  if (name.length < 3 || formattedPrice <= 0) return { error: 'Invalid fields!' }

  const newProduct: Product = {
    id: String(products.length + 1),
    name,
    price: formattedPrice,
    category,
    favorite: false,
  }

  products = [...products, newProduct]

  return redirect('/catalog')
}

async function toggleFavoriteAction({ request }: { request: Request }) {
  const formData = await request.formData()

  const productId = String(formData.get('productId') ?? '')
  const nextFavorite = String(formData.get('favorite') ?? '') === 'true'

  products = products.map(product =>
    product.id === productId ? { ...product, favorite: nextFavorite } : product,
  )

  return { ok: true }
}

const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    loader: rootLoader,
    Component: RootLayout,
    children: [
      { path: 'catalog', loader: productsLoader, action: catalogAction, Component: CatalogPage },
      {
        path: 'catalog/:productId',
        loader: productDetailLoader,
        Component: ProductDetailPage,
        errorElement: <DetailErrorPage />,
      },
      {
        path: 'catalog/toggle-favorite',
        action: toggleFavoriteAction,
      },
    ],
  },
])

export default function CatalogApp() {
  return <RouterProvider router={router} />
}
