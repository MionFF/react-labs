import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const schema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters!'),
    email: z
      .string()
      .trim()
      .pipe(z.email({ message: 'Email is incorrect!' })),
    password: z.string().trim().min(6, 'Password must be at least 6 characters!'),
    confirmPassword: z.string(),
    country: z.string().trim().min(1, 'Country is not defined'),
    consent: z.boolean().refine(val => val === true, {
      message: 'You must agree with consent!',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type SignupFormValues = z.infer<typeof schema>

function fakeRequest(values: SignupFormValues) {
  return new Promise<SignupFormValues>((resolve, reject) => {
    setTimeout(() => {
      if (values.email === 'taken@example.com') {
        reject(new Error('Email is already taken'))
        return
      }

      resolve(values)
    }, 800)
  })
}

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      consent: false,
    },
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const [serverError, setServerError] = useState('')

  async function onSubmit(values: SignupFormValues) {
    try {
      setServerError('')
      await fakeRequest(values)
      console.log('Submit finished:', values)
    } catch (error) {
      if (error instanceof Error) setServerError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor='name'>Name:</label>
      <input id='name' {...register('name')} className='m-2 outline-none ring-2' /> <br />
      {errors.name && <p className='text-red-600'>{errors.name.message}</p>}
      <label htmlFor='email'>Email:</label>
      <input id='email' {...register('email')} className='m-2 outline-none ring-2' /> <br />
      {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
      {serverError && <p className='text-red-600'>{serverError}</p>}
      <label htmlFor='password'>Password:</label>
      <input
        type='password'
        id='password'
        {...register('password')}
        className='m-2 outline-none ring-2'
      />{' '}
      <br />
      {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
      <label htmlFor='confirmPassword'>Confirm password:</label>
      <input
        type='password'
        id='confirmPassword'
        {...register('confirmPassword')}
        className='m-2 outline-none ring-2'
      />{' '}
      <br />
      {errors.confirmPassword && <p className='text-red-600'>{errors.confirmPassword.message}</p>}
      <label htmlFor='country'>Country:</label>
      <select id='country' {...register('country')} className='border rounded m-2 cursor-pointer'>
        <option value=''>Choose country</option>
        <option value='ru'>Russia</option>
        <option value='us'>USA</option>
        <option value='es'>Spain</option>
        <option value='ar'>Argentina</option>
      </select>{' '}
      <br />
      {errors.country && <p className='text-red-600'>{errors.country.message}</p>}
      <label htmlFor='consent'>I agree with terms of use </label>
      <input
        id='consent'
        type='checkbox'
        {...register('consent')}
        className='cursor-pointer'
      />{' '}
      <br />
      {errors.consent && <p className='text-red-600'>{errors.consent.message}</p>}
      <button
        type='submit'
        disabled={!isValid || isSubmitting}
        className='p-1 my-2 border rounded cursor-pointer'
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
