import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { createTask } from './tasksApi'

const schema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  assigneeEmail: z.email('Enter a valid email'),
})

type FormValues = z.infer<typeof schema>

export default function TaskCreatePage() {
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      assigneeEmail: '',
    },
  })

  const { mutateAsync } = useMutation({
    mutationFn: createTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
      navigate('/tasks?created=1')
    },
    onError: () => {
      setServerError('Failed to create task')
    },
  })

  const onSubmit = handleSubmit(async values => {
    setServerError('')

    try {
      await mutateAsync(values)
    } catch {
      // handled by onError
    }
  })

  return (
    <section>
      <h1 className='font-semibold'>Create Task</h1>

      <form onSubmit={onSubmit} noValidate>
        <label htmlFor='title'>Title</label>
        <input id='title' {...register('title')} className='mx-2 outline-none ring-2' />

        <label htmlFor='assigneeEmail'>Assignee email</label>
        <input
          id='assigneeEmail'
          {...register('assigneeEmail')}
          className='mx-2 outline-none ring-2'
        />

        {errors.title ? (
          <p role='alert' className='text-red-600'>
            {errors.title.message}
          </p>
        ) : null}
        {errors.assigneeEmail ? (
          <p role='alert' className='text-red-600'>
            {errors.assigneeEmail.message}
          </p>
        ) : null}
        {serverError ? (
          <p role='alert' className='text-red-600'>
            {serverError}
          </p>
        ) : null}

        <button
          type='submit'
          disabled={!isValid || isSubmitting}
          className='p-1 border rounded cursor-pointer'
        >
          {isSubmitting ? 'Creating...' : 'Create task'}
        </button>
      </form>
    </section>
  )
}
