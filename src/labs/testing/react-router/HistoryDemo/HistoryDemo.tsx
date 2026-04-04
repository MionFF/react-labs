import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'

function StepOne() {
  return <h1>Step 1</h1>
}

function StepTwo() {
  return <h1>Step 2</h1>
}

function ReviewPage() {
  const navigate = useNavigate()

  return (
    <section>
      <h1>Review</h1>
      <button onClick={() => navigate(-1)}>Back</button>
    </section>
  )
}

function CurrentPath() {
  const location = useLocation()
  return <p>Path: {location.pathname}</p>
}

export default function HistoryDemo() {
  return (
    <>
      <CurrentPath />

      <Routes>
        <Route path='/step-1' element={<StepOne />} />
        <Route path='/step-2' element={<StepTwo />} />
        <Route path='/review' element={<ReviewPage />} />
      </Routes>
    </>
  )
}
