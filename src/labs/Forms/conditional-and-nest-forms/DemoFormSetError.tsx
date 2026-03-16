import { useForm } from 'react-hook-form'

type FormValues = {
  email: string
  password: string
}

export default function DemoFormSetError() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: FormValues) {
    clearErrors()

    if (values.email === 'crash@example.com') {
      setError('root.serverError', {
        type: 'server',
        message: 'Server error. Try again.',
      })
      return
    }

    if (values.email === 'taken@example.com') {
      setError('email', {
        type: 'server',
        message: 'Email is already taken',
      })
      return
    }

    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder='Email' className='mx-2 outline-none ring-2' />
      {errors.email?.message && <p className='text-red-600'>{errors.email.message}</p>}

      <input
        {...register('password')}
        placeholder='Password'
        className='mx-2 outline-none ring-2'
      />
      {errors.root?.serverError?.message && (
        <p className='text-red-600'>{errors.root?.serverError?.message}</p>
      )}

      <button type='submit' className='p-1 border rounded cursor-pointer'>
        Submit
      </button>
    </form>
  )
}
