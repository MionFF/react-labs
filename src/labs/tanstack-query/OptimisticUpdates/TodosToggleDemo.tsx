import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

type Todo = {
  id: number
  title: string
  completed: boolean
}

type TodoCreateInput = { title: string }
type TodoToggleInput = { id: number; completed: boolean }

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)
  return res.json()
}

async function createTodo({ title }: TodoCreateInput) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)
  return res.json()
}

async function toggleTodo({ id, completed }: TodoToggleInput) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !completed }),
  })
  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)
  return res.json()
}

export default function TodosToggleDemo() {
  const [title, setTitle] = useState('')
  const queryClient = useQueryClient()

  const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const todosCreateMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => setTitle(''),
  })

  const todosToggleMutation = useMutation({
    mutationFn: toggleTodo,
    onMutate: async (variables: TodoToggleInput) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousData = queryClient.getQueryData<Todo[]>(['todos'])

      queryClient.setQueryData<Todo[]>(['todos'], old => {
        if (!old) return []
        return old.map(todo =>
          todo.id === variables.id ? { ...todo, completed: !todo.completed } : todo,
        )
      })

      return { previousData }
    },
    onError: (_error, _todoId, context) => {
      queryClient.setQueryData(['todos'], context?.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  function onToggle(id: number, completed: boolean) {
    todosToggleMutation.mutate({ id, completed })
  }

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!title.trim()) return
    todosCreateMutation.mutate({ title })
  }

  if (todosQuery.isPending)
    return (
      <p role='status' aria-live='polite'>
        Loading...
      </p>
    )
  if (todosQuery.isError) return <p role='alert'>{todosQuery.error.message}</p>

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor='create-input'>Title:</label>
      <input
        type='text'
        id='create-input'
        className='mx-2 outline-none ring-2'
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button
        type='submit'
        disabled={todosCreateMutation.isPending || !title.trim()}
        className='p-1 border rounded cursor-pointer'
      >
        Create todo
      </button>

      <ul>
        {todosQuery.data.map(todo => (
          <li key={todo.id}>
            <label>
              <span>{todo.title}</span>
              <input
                type='checkbox'
                disabled={todosToggleMutation.isPending}
                checked={todo.completed}
                onChange={() => onToggle(todo.id, todo.completed)}
              />
            </label>
          </li>
        ))}
      </ul>
      {todosCreateMutation.isPending && (
        <p className='opacity-50'>
          {todosCreateMutation.variables.title} <input type='checkbox' />
        </p>
      )}
    </form>
  )
}
