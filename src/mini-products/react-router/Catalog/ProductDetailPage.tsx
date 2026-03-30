import { Link, useLoaderData } from 'react-router-dom'
import type { Product } from './types'
import FavoriteButton from './FavoriteButton'

export default function ProductDetailPage() {
  const product = useLoaderData() as Product

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <FavoriteButton product={product} />{' '}
      <Link to={'/catalog'} className='px-3 py-1 border rounded cursor-pointer'>
        Back to catalog
      </Link>
    </div>
  )
}
