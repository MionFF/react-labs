import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const schema = z.object({
  email: z.email('Enter a valid email'),
})

type FormValues = z.infer<typeof schema>

type Props = {
  submitEmail: (values: FormValues) => Promise<void>
}

export default function EmailForm({ submitEmail }: Props) {
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit(async values => {
    setServerError('')

    try {
      await submitEmail(values)
    } catch {
      setServerError('Server error')
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor='email-input'>Email:</label>
      <input {...register('email')} id='email-input' className='mx-2 outline-none ring-2' />
      {errors.email ? (
        <p role='alert' className='text-red-600'>
          {errors.email.message}
        </p>
      ) : null}
      {serverError && (
        <p role='alert' className='text-red-600'>
          {serverError}
        </p>
      )}

      <button
        type='submit'
        disabled={!isValid || isSubmitting}
        className='p-1 border rounded cursor-pointer'
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
