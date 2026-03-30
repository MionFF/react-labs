import { useFetcher } from 'react-router-dom'
import type { Product } from './types'

export default function FavoriteButton({ product }: { product: Product }) {
  const fetcher = useFetcher()

  const optimisticFavorite = fetcher.formData
    ? fetcher.formData.get('favorite') === 'true'
    : product.favorite

  return (
    <fetcher.Form method='post' action='/catalog/toggle-favorite'>
      <input type='hidden' name='productId' value={product.id} />
      <input type='hidden' name='favorite' value={String(!product.favorite)} />

      <button type='submit' className='mt-2 mb-4 p-1 block border rounded cursor-pointer'>
        {optimisticFavorite ? '★ Favorited' : '☆ Favorite'}
      </button>
    </fetcher.Form>
  )
}
