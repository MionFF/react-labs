import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'

function Home() {
  return (
    <section>
      <h1>Home</h1>
      <Link to='/users/42'>Open profile</Link>
    </section>
  )
}

function UserProfile() {
  const { id } = useParams()

  return <h1>User {id}</h1>
}

function LocationInfo() {
  const location = useLocation()

  return <p>Current path: {location.pathname}</p>
}

export default function RouterDemo() {
  return (
    <>
      <LocationInfo />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/users/:id' element={<UserProfile />} />
      </Routes>
    </>
  )
}
