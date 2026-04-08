import { useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!form.email.trim()) {
      setError('Email is required')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      })

      if (!res.ok) {
        throw new Error('Signup failed')
      }

      navigate('/dashboard')
    } catch {
      setError('Failed to create account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='mx-auto mt-10 max-w-md rounded-2xl border p-6 shadow-sm'>
      <h1 className='mb-6 text-2xl font-semibold'>Create account</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='signup-email' className='mb-1 block text-sm font-medium'>
            Email
          </label>
          <input
            id='signup-email'
            value={form.email}
            onChange={e => updateField('email', e.target.value)}
            className='w-full rounded-lg border px-3 py-2 outline-none ring-0 focus:border-black'
          />
        </div>

        <div>
          <label htmlFor='signup-password' className='mb-1 block text-sm font-medium'>
            Password
          </label>
          <input
            id='signup-password'
            type='password'
            value={form.password}
            onChange={e => updateField('password', e.target.value)}
            className='w-full rounded-lg border px-3 py-2 outline-none ring-0 focus:border-black'
          />
        </div>

        <div>
          <label htmlFor='signup-confirm' className='mb-1 block text-sm font-medium'>
            Confirm password
          </label>
          <input
            id='signup-confirm'
            type='password'
            value={form.confirmPassword}
            onChange={e => updateField('confirmPassword', e.target.value)}
            className='w-full rounded-lg border px-3 py-2 outline-none ring-0 focus:border-black'
          />
        </div>

        {error ? (
          <p role='alert' className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>
            {error}
          </p>
        ) : null}

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full rounded-lg border px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isSubmitting ? 'Creating...' : 'Create account'}
        </button>
      </form>
    </section>
  )
}

function DashboardPage() {
  return (
    <section className='mx-auto mt-10 max-w-md rounded-2xl border p-6 shadow-sm'>
      <h1 className='text-2xl font-semibold'>Dashboard</h1>
      <p className='mt-2 text-sm text-neutral-600'>Welcome aboard</p>
    </section>
  )
}

export default function SignupApp() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}
