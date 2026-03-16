import { useForm } from 'react-hook-form'

type FormValues = {
  contact: {
    type: string
    value: string
    countryCode: string
  }
}

export default function BadConditionalForm() {
  const { register, watch, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      contact: {
        type: '',
        value: '',
        countryCode: '',
      },
    },
  })

  const type = watch('contact.type')

  function onSubmit(values: FormValues) {
    console.log('SUBMIT:', values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor='type'>Type</label>
      <select
        id='type'
        {...register('contact.type')}
        className='p-1 mx-2 border rounded cursor-pointer'
      >
        <option value=''>Choose type</option>
        <option value='email'>Email</option>
        <option value='phone'>Phone</option>
      </select>

      <label htmlFor='value'>Value</label>
      <input id='value' {...register('contact.value')} className='mx-2 outline-none ring-2' />

      {type === 'phone' && (
        <>
          <label htmlFor='countryCode'>Country code</label>
          <input
            id='countryCode'
            {...register('contact.countryCode')}
            className='mx-2 outline-none ring-2'
          />
        </>
      )}

      <button type='submit' className='p-1 border rounded cursor-pointer'>
        Submit
      </button>
    </form>
  )
}
