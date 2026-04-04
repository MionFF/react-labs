import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const schema = z
  .object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters'),
    email: z
      .string()
      .trim()
      .pipe(z.email({ message: 'Invalid email' })),
    password: z.string().trim().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Confirm password mismatch',
  })

type FormValues = z.infer<typeof schema>

type Props = {
  submitForm: (values: FormValues) => Promise<void>
}

export default function RegisterForm({ submitForm }: Props) {
  const [serverError, setServerError] = useState('')

  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = handleSubmit(async (values: FormValues) => {
    setServerError('')

    if (values.email !== 'taken@example.com') {
      await submitForm(values)
    } else setServerError('Email is already taken')
  })

  return (
    <form onSubmit={onSubmit} noValidate className='p-4 flex flex-col w-fit'>
      <label htmlFor={nameId}>Name:</label>
      <input {...register('name')} id={nameId} className='mx-2 outline-none ring-2' />
      {errors.name && (
        <p role='alert' className='text-red-600'>
          {errors.name.message}
        </p>
      )}

      <label htmlFor={emailId}>Email:</label>
      <input {...register('email')} id={emailId} className='mx-2 outline-none ring-2' />
      {errors.email && (
        <p role='alert' className='text-red-600'>
          {errors.email.message}
        </p>
      )}

      <label htmlFor={passwordId}>Password:</label>
      <input
        type='password'
        {...register('password')}
        id={passwordId}
        className='mx-2 outline-none ring-2'
      />
      {errors.password && (
        <p role='alert' className='text-red-600'>
          {errors.password.message}
        </p>
      )}

      <label htmlFor={confirmPasswordId}>Confirm password:</label>
      <input
        type='password'
        {...register('confirmPassword')}
        id={confirmPasswordId}
        className='mx-2 outline-none ring-2'
      />
      {errors.confirmPassword && (
        <p role='alert' className='text-red-600'>
          {errors.confirmPassword.message}
        </p>
      )}

      {serverError && (
        <p role='alert' className='text-red-600'>
          {serverError}
        </p>
      )}

      <button
        type='submit'
        disabled={!isValid || isSubmitting}
        className='mt-4 p-1 border rounded cursor-pointer'
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
