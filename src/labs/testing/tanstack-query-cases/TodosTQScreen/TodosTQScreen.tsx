import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTodo, fetchTodos } from './todosApi'

export default function TodosTQScreen() {
  const [title, setTitle] = useState('')
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
      setTitle('')
      await queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    await mutateAsync({ title: trimmed })
  }

  if (isLoading) {
    return <p>Loading todos...</p>
  }

  if (isError) {
    return <p>Failed to load todos</p>
  }

  return (
    <section>
      <h1>Todos</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor='todo-title'>Todo title</label>
        <input id='todo-title' value={title} onChange={e => setTitle(e.target.value)} />
        <button type='submit' disabled={isPending}>
          {isPending ? 'Adding...' : 'Add'}
        </button>
      </form>

      <ul aria-label='Todos list'>
        {data.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </section>
  )
}
