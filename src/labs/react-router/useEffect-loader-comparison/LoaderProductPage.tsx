import { useLoaderData } from 'react-router-dom'

type Product = {
  title: string
  price: number
  category: string
}

export default function LoaderProductPage() {
  const data = useLoaderData() as Product

  if (!data) return <p role='alert'>Failed to load data</p>

  return (
    <div>
      <h2 className='font-semibold'>{data.title}</h2>
      <p>Price: {data.price}</p>
      <p>Category: {data.category}</p>
    </div>
  )
}
