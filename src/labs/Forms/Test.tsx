import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const schema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: 'Email is incorrect' })),
  password: z.string().trim().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

function fakeRequest(values: FormValues) {
  return new Promise<FormValues>(resolve => {
    setTimeout(() => {
      resolve(values)
    }, 800)
  })
}

export default function Test() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: FormValues) {
    console.log('start:', values)
    await fakeRequest(values)
    console.log('finished')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor='email'>Email: </label>
      <input id='email' {...register('email')} className='outline-none ring-2' />
      {errors.email && <p className='text-red-600'>{errors.email?.message}</p>}

      <label htmlFor='password'>Password: </label>
      <input
        id='password'
        type='password'
        {...register('password')}
        className='outline-none ring-2'
      />
      {errors.password && <p className='text-red-600'>{errors.password?.message}</p>}

      <button type='submit' disabled={isSubmitting} className='p-1 border rounded cursor-pointer'>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
