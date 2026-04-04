import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTodo, fetchTodos } from './todosApi'

export default function TodoBoard() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [serverError, setServerError] = useState('')

  const queryClient = useQueryClient()

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    retry: false,
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {
      setMessage('Todo added')
      setServerError('')
      setTitle('')
      await queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: () => {
      setServerError('Failed to add todo')
      setMessage('')
    },
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    try {
      await mutateAsync({ title: trimmed })
    } catch {
      // error UI already handled by onError
    }
  }

  if (isLoading) {
    return <p>Loading todos...</p>
  }

  if (isError) {
    return <p>Failed to load todos</p>
  }

  return (
    <section>
      <h1>Todo Board</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor='todo-title'>Todo title</label>
        <input id='todo-title' value={title} onChange={e => setTitle(e.target.value)} />

        <button type='submit' disabled={isPending}>
          {isPending ? 'Adding...' : 'Add todo'}
        </button>
      </form>

      {message ? <p>{message}</p> : null}
      {serverError ? <p role='alert'>{serverError}</p> : null}

      <ul aria-label='Todos list'>
        {data.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </section>
  )
}
