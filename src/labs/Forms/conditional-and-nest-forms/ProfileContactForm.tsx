import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  user: {
    name: string
    contact: {
      type: string
      value: string
      countryCode: string
    }
  }
}

type FieldProps = { htmlFor: string; label: string; children: React.ReactNode; error?: string }

function Field({ htmlFor, label, children, error }: FieldProps) {
  return (
    <>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <p className='text-red-600'>{error}</p>}
    </>
  )
}

export default function ProfileContactForm() {
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      user: {
        name: '',
        contact: {
          type: '',
          value: '',
          countryCode: '',
        },
      },
    },
  })

  const type = watch('user.contact.type')

  useEffect(() => {
    if (type !== 'phone') {
      setValue('user.contact.countryCode', '')
    }
  }, [type, setValue])

  function onSubmit(values: FormValues) {
    console.log('Submit:', values)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className='bg-[#333] text-white min-h-screen'
    >
      <Field htmlFor='user-name' label='Name:'>
        <input id='user-name' {...register('user.name')} className='mx-2 outline-none ring-2' />
      </Field>

      <label htmlFor='contact-type'>Contact:</label>
      <select
        id='contact-type'
        {...register('user.contact.type')}
        className='mx-2 bg-[#333] text-white border rounded cursor-pointer'
      >
        <option value=''>Choose type</option>
        <option value='email'>email</option>
        <option value='phone'>phone</option>
      </select>

      <Field htmlFor='contact-value' label='Value:'>
        <input
          id='contact-value'
          {...register('user.contact.value')}
          className='mx-2 outline-none ring-2'
        />
      </Field>

      {type === 'phone' && (
        <>
          <Field htmlFor='country-code' label='Country code:'>
            <input
              id='country-code'
              {...register('user.contact.countryCode')}
              className='mx-2 outline-none ring-2'
            />
          </Field>
        </>
      )}

      <button type='submit' className='p-1 border rounded cursor-pointer'>
        Submit
      </button>
    </form>
  )
}
