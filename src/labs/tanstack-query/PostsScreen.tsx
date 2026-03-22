import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

type Post = {
  id: number
  title: string
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)
  return res.json()
}

async function createPost(values: { title: string }) {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })

  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)

  return res.json()
}

export default function PostsScreen() {
  const queryClient = useQueryClient()

  const postsMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setTitle('')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const { data, error, isPending, isError, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  const [title, setTitle] = useState('')

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!title.trim()) return

    postsMutation.mutate({ title })
  }

  if (isPending)
    return (
      <p role='status' aria-live='polite'>
        Loading...
      </p>
    )
  if (isError) return <p role='alert'>{error.message}</p>

  return (
    <form onSubmit={e => onSubmit(e)}>
      <label htmlFor='add-post'>Post title:</label>
      <input
        type='text'
        id='add-post'
        className='mx-2 outline-none ring-2'
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button
        type='submit'
        disabled={!title.trim() || postsMutation.isPending}
        className='p-1 border rounded cursor-pointer'
      >
        Create post
      </button>

      {isFetching && (
        <p role='status' aria-live='polite'>
          Background updating...
        </p>
      )}

      {postsMutation.isPending && (
        <p role='status' aria-live='polite'>
          Saving...
        </p>
      )}
      {postsMutation.isError && <p role='alert'>{postsMutation.error.message}</p>}

      <ul className='mt-4 p-4'>
        {data.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </form>
  )
}
