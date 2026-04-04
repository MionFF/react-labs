import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  email: z.email('Enter a valid email'),
})

type FormValues = z.infer<typeof schema>

type Props = {
  saveEmail: (values: FormValues) => Promise<void>
}

export default function NewsletterScreen({ saveEmail }: Props) {
  const [message, setMessage] = useState('')
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = handleSubmit(async values => {
    setMessage('')
    setServerError('')

    try {
      await saveEmail(values)
      setMessage('Subscribed successfully')
    } catch {
      setServerError('Subscription failed')
    }
  })

  return (
    <section>
      <h1>Newsletter</h1>

      <form onSubmit={onSubmit} noValidate>
        <label htmlFor='email'>Email</label>
        <input id='email' {...register('email')} className='mx-2 outline-none ring-2' />

        {errors.email ? (
          <p role='alert' className='text-red-600'>
            {errors.email.message}
          </p>
        ) : null}
        {serverError ? (
          <p role='alert' className='text-red-600'>
            {serverError}
          </p>
        ) : null}
        {message ? <p>{message}</p> : null}

        <button
          type='submit'
          disabled={!isValid || isSubmitting}
          className='p-1 border rounded cursor-pointer'
        >
          {isSubmitting ? 'Submitting...' : 'Subscribe'}
        </button>
      </form>
    </section>
  )
}
