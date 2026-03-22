import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

type TimeoutViewProps = {
  children: React.ReactNode
  timeout?: number
}

function TimeoutView({ children, timeout = 1500 }: TimeoutViewProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setTimeout(() => setVisible(false), timeout)

    return () => clearTimeout(id)
  }, [timeout])

  if (!visible) return null

  return <>{children}</>
}

type Post = {
  title: string
}

async function createPost(values: Post) {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })

  if (!res.ok) throw Error(`HTTP_ERROR: ${res.status}`)

  return res.json()
}

export default function CreatePostDemo() {
  const [title, setTitle] = useState('')

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => setTitle(''),
  })

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!title.trim()) return
    createPostMutation.mutate({ title: title })
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor='title-input'>Title:</label>
      <input
        type='text'
        id='title-input'
        className='mx-2 outline-none ring-2'
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button
        type='submit'
        disabled={createPostMutation.isPending}
        className='p-1 border rounded cursor-pointer'
      >
        {createPostMutation.isPending ? 'Creating...' : 'Create'}
      </button>

      {createPostMutation.isPending && (
        <p role='status' aria-live='polite'>
          Saving...
        </p>
      )}
      {createPostMutation.isSuccess && (
        <TimeoutView timeout={1500}>
          <p role='status' aria-live='polite'>
            Created!
          </p>
        </TimeoutView>
      )}
      {createPostMutation.isError && <p role='alert'>{createPostMutation.error.message}</p>}
    </form>
  )
}
