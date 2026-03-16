import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  type: string
  email: string
  countryCode: string
}

export default function DemoFormWithUnregister() {
  const { register, watch, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      type: '',
      email: '',
      countryCode: '',
    },
  })

  const type = watch('type')

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  useEffect(() => {
    if (type !== 'phone') {
      setValue('countryCode', '')
    }
  }, [type, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('type')} className='p-1 border rounded cursor-pointer'>
        <option value=''>Choose type</option>
        <option value='email'>email</option>
        <option value='phone'>phone</option>
      </select>

      <input
        {...register('email')}
        placeholder='email/value'
        className='mx-2 outline-none ring-2'
      />

      {type === 'phone' && (
        <input
          {...register('countryCode')}
          placeholder='+34'
          className='mx-2 outline-none ring-2'
        />
      )}

      <button type='submit' className='p-1 border rounded cursor-pointer'>
        Submit
      </button>
    </form>
  )
}
