import { useEffect, useState } from 'react'

type Product = {
  title: string
  price: number
  category: string
}

export default function EffectProductPage() {
  const [data, setData] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function fetchProduct() {
      try {
        setError(null)

        const res = await fetch('https://dummyjson.com/products/1')
        if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)

        const productData: Product = await res.json()

        if (!ignore) {
          setData(productData)
        }
      } catch (error) {
        if (!ignore) {
          setError(error instanceof Error ? error.message : 'Unknown error')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      ignore = true
    }
  }, [])

  if (isLoading) return <p role='status'>Loading...</p>
  if (error) return <p role='alert'>{error}</p>
  if (!data) return <p>No product found</p>

  return (
    <div>
      <h2 className='font-semibold'>{data.title}</h2>
      <p>Price: {data.price}</p>
      <p>Category: {data.category}</p>
    </div>
  )
}
