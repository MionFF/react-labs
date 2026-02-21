import { useId, useState } from 'react'
import type React from 'react'

export default function LoginForm() {
  const emailId = useId()
  const passId = useId()

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [touched, setTouched] = useState({
    email: false,
    pass: false,
  })

  const emailError = touched.email && !email.includes('@') ? 'Email must include @' : ''
  const passError = touched.pass && pass.length < 6 ? 'Password must be at least 6 chars' : ''

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched({ email: true, pass: true })
    if (!emailError && !passError) console.log({ email, pass })
  }

  return (
    <form onSubmit={onSubmit} className='grid gap-4 max-w-sm border border-black rounded p-6'>
      <div className='grid gap-1'>
        <label htmlFor={emailId} className='text-sm font-medium'>
          Email
        </label>
        <input
          id={emailId}
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, email: true }))}
          aria-invalid={emailError ? 'true' : 'false'}
          aria-describedby={emailError ? `${emailId}-err` : undefined}
          className='border rounded px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400'
        />
        {emailError ? (
          <p id={`${emailId}-err`} className='text-sm text-red-300'>
            {emailError}
          </p>
        ) : null}
      </div>

      <div className='grid gap-1'>
        <label htmlFor={passId} className='text-sm font-medium'>
          Password
        </label>
        <input
          id={passId}
          type='password'
          value={pass}
          onChange={e => setPass(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, pass: true }))}
          aria-invalid={passError ? 'true' : 'false'}
          aria-describedby={passError ? `${passId}-err` : undefined}
          className='border rounded px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400'
        />
        {passError ? (
          <p id={`${passId}-err`} className='text-sm text-red-300'>
            {passError}
          </p>
        ) : null}
      </div>

      <button
        type='submit'
        className='rounded px-3 py-2 bg-indigo-800 hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400'
      >
        Sign in
      </button>
    </form>
  )
}
