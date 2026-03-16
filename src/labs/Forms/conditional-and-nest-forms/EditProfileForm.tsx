import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  fullName: string
  email: string
}

const serverData = {
  fullName: 'Hilda Johnes',
  email: 'hilda194@gmail.com',
}

export default function EditProfileForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      email: '',
    },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  useEffect(() => {
    reset(serverData)
  }, [reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('fullName')}
        placeholder='Full name'
        className='mx-2 outline-none ring-2'
      />
      <input {...register('email')} placeholder='Email' className='mx-2 outline-none ring-2' />

      <p className='my-2'>{isDirty ? 'Dirty' : 'Clean'}</p>

      <button type='submit' className='p-1 border rounded cursor-pointer'>
        Save
      </button>
      <button
        type='button'
        onClick={() => reset(serverData)}
        className='p-1 border rounded cursor-pointer'
      >
        Reset to loaded values
      </button>
    </form>
  )
}
