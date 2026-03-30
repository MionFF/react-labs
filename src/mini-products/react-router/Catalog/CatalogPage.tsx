import { useMemo } from 'react'
import type { CatalogActionData, Category, Product, RootLoaderData, SortOption } from './types'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
} from 'react-router-dom'
import { useCatalogSearchParams } from './helpers'
import FavoriteButton from './FavoriteButton'

export default function CatalogPage() {
  const actionData = useActionData() as CatalogActionData | undefined
  const rootData = useRouteLoaderData('root') as RootLoaderData

  const navigation = useNavigation()
  const submitting = navigation.state === 'submitting'

  const productsList = useLoaderData() as Product[]

  const { q, sort, category, handleQueryChange, handleSortChange, handleCategoryChange } =
    useCatalogSearchParams()

  const visibleProducts = useMemo(() => {
    const query = q.trim().toLowerCase()
    let filtered = productsList.filter(p => p.name.toLowerCase().includes(query))

    switch (sort) {
      case 'price-asc': {
        filtered = filtered.toSorted((a, b) => a.price - b.price)
        break
      }
      case 'price-desc': {
        filtered = filtered.toSorted((a, b) => b.price - a.price)
        break
      }
      default: {
        filtered = filtered.toSorted((a, b) => a.name.localeCompare(b.name))
      }
    }

    switch (category) {
      case 'phones': {
        filtered = filtered.filter(p => p.category === 'phones')
        break
      }
      case 'laptops': {
        filtered = filtered.filter(p => p.category === 'laptops')
        break
      }
      default: {
        return filtered
      }
    }

    return filtered
  }, [q, sort, category, productsList])

  return (
    <>
      <Form method='post' className='mb-4 p-4 border'>
        <h1 className='mb-3 text-l font-semibold'>Add product (by {rootData.currentUser})</h1>

        <label htmlFor='name'>Name:</label>
        <input type='text' name='name' id='name' className='mx-2 outline-none ring-2' />

        <label htmlFor='price'>Price:</label>
        <input type='number' name='price' id='price' min={0} className='mx-2 outline-none ring-2' />

        <label htmlFor='category'>Category:</label>
        <select name='category' id='category' className='ml-2 p-1 border rounded cursor-pointer'>
          <option value='phones'>Phones</option>
          <option value='laptops'>Laptops</option>
        </select>

        {actionData?.error && (
          <p className='text-red-600' role='status' aria-live='polite'>
            {actionData.error}
          </p>
        )}

        <button
          type='submit'
          disabled={submitting}
          className='ml-4 p-1 border rounded cursor-pointer'
        >
          {submitting ? 'Adding...' : 'Add'}
        </button>
      </Form>

      <div className='mb-4 p-4 border'>
        <label htmlFor='query-input'>Query:</label>
        <input
          type='text'
          name='query-input'
          id='query-input'
          className='mx-2 outline-none ring-2'
          value={q}
          onChange={e => handleQueryChange(e.target.value)}
        />

        <label htmlFor='sort-select'>Sort:</label>
        <select
          name='sort-select'
          id='sort-select'
          className='mx-2 p-1 border rounded cursor-pointer'
          value={sort}
          onChange={e => handleSortChange(e.target.value as SortOption)}
        >
          <option value='name'>Name</option>
          <option value='price-asc'>Price ascend</option>
          <option value='price-desc'>Price descend</option>
        </select>

        <label htmlFor='category-select'>Category:</label>
        <select
          name='category-select'
          id='category-select'
          className='mx-2 p-1 border rounded cursor-pointer'
          value={category}
          onChange={e => handleCategoryChange(e.target.value as Category)}
        >
          <option value='all'>All</option>
          <option value='phones'>Phones</option>
          <option value='laptops'>Laptops</option>
        </select>
      </div>

      <ul className='p-4'>
        {visibleProducts.length ? (
          visibleProducts.map(p => (
            <li
              key={p.id}
              className='my-2 p-1 border rounded cursor-pointer transition duration-200 ease hover:-translate-y-1 hover:bg-[#f3f3f3]'
            >
              <Link to={p.id}>
                <h2 className='font-semibold'>{p.name}</h2>
                <p>Price: ${p.price}</p>
                <p>Category: {p.category}</p>
              </Link>

              <FavoriteButton product={p} />
            </li>
          ))
        ) : (
          <li role='status' aria-live='polite'>
            No matches
          </li>
        )}
      </ul>
    </>
  )
}
