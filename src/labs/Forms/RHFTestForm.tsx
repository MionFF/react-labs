import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: 'Enter a valid email' })),
  password: z.string().trim().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function fakeRequest(values: LoginFormValues) {
  return new Promise<LoginFormValues>(resolve => {
    setTimeout(() => resolve(values), 800)
  })
}

export default function RHFTestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    console.log('submit start', values)
    await fakeRequest(values)
    console.log('submit success')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor={'email'}>Email:</label>
      <input id={'email'} {...register('email')} className='outline-none ring-2 m-2' /> <br />
      {errors.email && <p className='mb-2 text-red-600'>{errors.email.message}</p>}
      <label htmlFor={'password'}>Password:</label>
      <input
        id={'password'}
        type='password'
        {...register('password')}
        className='outline-none ring-2 m-2'
      />{' '}
      <br />
      {errors.password && <p className='mb-2 text-red-600'>{errors.password.message}</p>}
      <button type='submit' disabled={isSubmitting} className='p-1 border rounded cursor-pointer'>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      <p>{isDirty ? 'Form changed' : 'Form untouched'}</p>
    </form>
  )
}
