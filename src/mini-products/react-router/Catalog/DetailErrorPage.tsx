import { Link, useRouteError } from 'react-router-dom'

export default function DetailErrorPage() {
  const error = useRouteError() as Error

  return (
    <div>
      <h1>Product detail error</h1>
      <p>{error.message}</p>
      <Link to={'/catalog'} className='px-3 py-1 border rounded cursor-pointer'>
        Back to catalog
      </Link>
    </div>
  )
}
