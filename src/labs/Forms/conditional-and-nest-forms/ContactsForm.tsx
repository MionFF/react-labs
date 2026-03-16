import { useForm, useFieldArray } from 'react-hook-form'

type FormValues = {
  contacts: {
    type: string
    value: string
  }[]
}

export default function ContactsForm() {
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      contacts: [{ type: '', value: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'contacts' })

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id} className='my-2'>
          <label htmlFor={`contact-type-${field.id}`} className='mr-2'>
            Type:
          </label>
          <select
            id={`contact-type-${field.id}`}
            {...register(`contacts.${index}.type`)}
            className='p-1 border rounded cursor-pointer'
          >
            <option value=''>Choose contact</option>
            <option value='email'>email</option>
            <option value='telegram'>telegram</option>
            <option value='linkedin'>linkedin</option>
          </select>

          <label htmlFor={`contact-value-${field.id}`} className='mx-2'>
            Contact:
          </label>
          <input
            id={`contact-value-${field.id}`}
            {...register(`contacts.${index}.value`)}
            className='mx-2 outline-none ring-2'
          />

          <button
            type='button'
            onClick={() => remove(index)}
            className='p-1 border rounded cursor-pointer'
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type='button'
        className='p-1 m-2 border rounded cursor-pointer'
        onClick={() => append({ type: '', value: '' })}
      >
        Add contact
      </button>

      <button type='submit' className='p-1 m-2 border rounded cursor-pointer'>
        Submit
      </button>
    </form>
  )
}
