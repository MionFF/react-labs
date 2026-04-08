import { useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'

function CheckoutPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!form.cardNumber.trim() || !form.expiry.trim() || !form.cvc.trim()) {
      setError('All payment fields are required')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        throw new Error('Payment failed')
      }

      navigate('/confirmation')
    } catch {
      setError('Payment failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='mx-auto mt-10 max-w-md rounded-2xl border p-6 shadow-sm'>
      <h1 className='mb-6 text-2xl font-semibold'>Checkout</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='card-number' className='mb-1 block text-sm font-medium'>
            Card number
          </label>
          <input
            id='card-number'
            value={form.cardNumber}
            onChange={e => updateField('cardNumber', e.target.value)}
            className='w-full rounded-lg border px-3 py-2 outline-none focus:border-black'
          />
        </div>

        <div>
          <label htmlFor='expiry' className='mb-1 block text-sm font-medium'>
            Expiry
          </label>
          <input
            id='expiry'
            value={form.expiry}
            onChange={e => updateField('expiry', e.target.value)}
            className='w-full rounded-lg border px-3 py-2 outline-none focus:border-black'
          />
        </div>

        <div>
          <label htmlFor='cvc' className='mb-1 block text-sm font-medium'>
            CVC
          </label>
          <input
            id='cvc'
            value={form.cvc}
            onChange={e => updateField('cvc', e.target.value)}
            className='w-full rounded-lg border px-3 py-2 outline-none focus:border-black'
          />
        </div>

        <div>
          <label htmlFor='phone' className='mb-1 block text-sm font-medium'>
            Phone
          </label>
          <input
            id='phone'
            value={form.phone}
            onChange={e => updateField('phone', e.target.value)}
            className='w-full rounded-lg border px-3 py-2 outline-none focus:border-black'
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
          {isSubmitting ? 'Processing...' : 'Pay now'}
        </button>
      </form>
    </section>
  )
}

function ConfirmationPage() {
  return (
    <section className='mx-auto mt-10 max-w-md rounded-2xl border p-6 shadow-sm'>
      <h1 className='text-2xl font-semibold'>Confirmation</h1>
      <p className='mt-2 text-sm text-neutral-600'>Payment successful</p>
      <p className='mt-1 text-sm text-neutral-500'>Order ID: 12345</p>
    </section>
  )
}

export default function CheckoutApp() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='/confirmation' element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  )
}
