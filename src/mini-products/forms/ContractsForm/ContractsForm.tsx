import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

const contactSchema = z
  .object({
    type: z.enum(['', 'email', 'phone', 'telegram']),
    value: z.string().trim().min(1, 'Value is required'),
    countryCode: z.string().trim().optional(),
  })
  .refine(
    contact => {
      if (contact.type === 'phone') {
        return (
          typeof contact.countryCode === 'string' &&
          contact.countryCode.length > 1 &&
          contact.countryCode.startsWith('+')
        )
      }

      return contact.countryCode === undefined || contact.countryCode === ''
    },
    {
      path: ['countryCode'],
      message: 'Country code is required for phone and must start with "+"',
    },
  )
  .refine(contact => contact.type.length > 0, {
    path: ['type'],
    message: 'Type is required',
  })

const schema = z.object({
  profile: z.object({
    fullName: z.string().trim().min(1, 'Name is required').min(3, 'Name is too short'),
    contacts: z.array(contactSchema).min(1, 'You must add at least 1 contact'),
  }),
})

type FormValues = z.infer<typeof schema>

type ServerIssue =
  | { kind: 'field'; field: 'profile.fullName'; message: string }
  | { kind: 'root'; message: string }

const demoProfile: FormValues = {
  profile: {
    fullName: 'Denis Ivanov',
    contacts: [
      { type: 'email', value: 'denis@example.com', countryCode: '' },
      { type: 'phone', value: '123456789', countryCode: '+34' },
    ],
  },
}

export default function ContactsForm() {
  const {
    register,
    handleSubmit,
    watch,
    unregister,
    reset,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      profile: {
        fullName: '',
        contacts: [
          {
            type: '',
            value: '',
            countryCode: '',
          },
        ],
      },
    },
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'profile.contacts',
  })

  const contacts = watch('profile.contacts')

  function fakeRequest(values: FormValues) {
    return new Promise<FormValues>((resolve, reject) => {
      setTimeout(() => {
        if (values.profile.fullName === 'crash') {
          reject({
            kind: 'root',
            message: 'Server error. Try again.',
          } satisfies ServerIssue)
          return
        }

        if (values.profile.fullName === 'taken') {
          reject({
            kind: 'field',
            field: 'profile.fullName',
            message: 'Name is already taken',
          } satisfies ServerIssue)
          return
        }

        resolve(values)
      }, 800)
    })
  }

  async function onSubmit(values: FormValues) {
    try {
      clearErrors()
      const data = await fakeRequest(values)
      console.log(data)
    } catch (error) {
      const issue = error as ServerIssue

      if (issue.kind === 'field') {
        setError(issue.field, {
          type: 'server',
          message: issue.message,
        })
      }

      if (issue.kind === 'root') {
        setError('root.serverError', {
          type: 'server',
          message: issue.message,
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor='full-name'>Name:</label>
      <input
        id='full-name'
        {...register('profile.fullName')}
        className='mx-2 outline-none ring-2'
      />
      {errors.profile?.fullName?.message && (
        <p role='status' aria-live='polite' className='text-red-600 mt-2 mb-3'>
          {errors.profile.fullName.message}
        </p>
      )}

      {fields.map((field, index) => {
        const rowType = contacts?.[index]?.type ?? ''

        return (
          <div key={field.id} className='my-3'>
            <label htmlFor={`type-${field.id}`}>Type:</label>
            <select
              id={`type-${field.id}`}
              {...register(`profile.contacts.${index}.type`, {
                onChange: e => {
                  if (e.target.value !== 'phone') {
                    unregister(`profile.contacts.${index}.countryCode`)
                  }
                },
              })}
              className='mx-2 p-1 border rounded cursor-pointer'
            >
              <option value=''>Choose type</option>
              <option value='email'>email</option>
              <option value='phone'>phone</option>
              <option value='telegram'>telegram</option>
            </select>
            {errors.profile?.contacts?.[index]?.type?.message && (
              <p role='status' aria-live='polite' className='text-red-600 mt-2 mb-3'>
                {errors.profile.contacts[index]?.type?.message}
              </p>
            )}

            <label htmlFor={`value-${field.id}`}>Value:</label>
            <input
              id={`value-${field.id}`}
              {...register(`profile.contacts.${index}.value`)}
              className='mx-2 outline-none ring-2'
            />
            {errors.profile?.contacts?.[index]?.value?.message && (
              <p role='status' aria-live='polite' className='text-red-600 mt-2 mb-3'>
                {errors.profile.contacts[index]?.value?.message}
              </p>
            )}

            {rowType === 'phone' && (
              <>
                <label htmlFor={`country-code-${field.id}`}>Country code:</label>
                <input
                  id={`country-code-${field.id}`}
                  {...register(`profile.contacts.${index}.countryCode`)}
                  className='mx-2 outline-none ring-2'
                />
                {errors.profile?.contacts?.[index]?.countryCode?.message && (
                  <p role='status' aria-live='polite' className='text-red-600 mt-2 mb-3'>
                    {errors.profile.contacts[index]?.countryCode?.message}
                  </p>
                )}
              </>
            )}

            <button
              type='button'
              onClick={() => remove(index)}
              className='p-1 border rounded cursor-pointer'
            >
              Remove
            </button>
          </div>
        )
      })}

      {errors.profile?.contacts?.message && (
        <p role='status' aria-live='polite' className='text-red-600 mt-2 mb-3'>
          {errors.profile.contacts.message}
        </p>
      )}

      {errors.root?.serverError?.message && (
        <p role='status' aria-live='polite' className='text-red-600 mt-2 mb-3'>
          {errors.root.serverError.message}
        </p>
      )}

      <button
        type='button'
        onClick={() => append({ type: '', value: '', countryCode: '' })}
        className='p-1 mt-4 border rounded cursor-pointer block'
      >
        Add contact
      </button>

      <button
        type='submit'
        disabled={isSubmitting || !isValid}
        className='p-1 mt-2 border rounded cursor-pointer block'
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>

      <button
        type='button'
        onClick={() => reset(demoProfile)}
        className='p-1 mt-2 mr-2 border rounded cursor-pointer'
      >
        Load demo profile
      </button>

      <button
        type='button'
        onClick={() => reset()}
        className='p-1 mt-2 mr-2 border rounded cursor-pointer'
      >
        Reset to empty form
      </button>

      <p role='status' aria-live='polite'>
        {isDirty ? 'Dirty' : 'Clean'}
      </p>
    </form>
  )
}
