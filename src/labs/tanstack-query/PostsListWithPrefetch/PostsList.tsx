import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

type Post = {
  id: number
  title: string
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)
  return res.json()
}

async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)
  return res.json()
}

function PostDetails({ postId }: { postId: number }) {
  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  if (postQuery.isPending)
    return (
      <p role='status' aria-live='polite'>
        Loading details...
      </p>
    )
  if (postQuery.isError) return <p role='alert'>{postQuery.error.message}</p>

  return (
    <div className='p-4 my-4 border rounded'>
      <h2 className='font-semibold'>{postQuery.data.title}</h2>
      <p>ID: {postQuery.data.id}</p>
    </div>
  )
}

const postsOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 30 * 1000,
  gcTime: 10 * 60 * 1000,
})

export default function PostsList() {
  const postsQuery = useQuery(postsOptions)
  const queryClient = useQueryClient()

  const [postDetailsId, setPostDetailsId] = useState<number | null>(null)

  function onDetailsOpen(postId: number) {
    setPostDetailsId(current => (current === postId ? null : postId))
  }

  if (postsQuery.isPending)
    return (
      <p role='status' aria-live='polite'>
        Loading...
      </p>
    )
  if (postsQuery.isError) return <p role='alert'>{postsQuery.error.message}</p>

  return (
    <ul>
      {postsQuery.data.map(post => (
        <li key={post.id} className='p-4 my-2 border rounded'>
          {post.title}
          <button
            onClick={() => onDetailsOpen(post.id)}
            onMouseEnter={() => {
              queryClient.prefetchQuery({
                queryKey: ['post', post.id],
                queryFn: () => fetchPost(post.id),
                staleTime: 30 * 1000,
                gcTime: 10 * 60 * 1000,
              })
              console.log('Prefetched!')
            }}
            className='p-1 m-2 border rounded cursor-pointer'
          >
            View details
          </button>
          {postDetailsId === post.id && <PostDetails postId={post.id} />}
        </li>
      ))}
      {postsQuery.isFetching && (
        <p role='status' aria-live='polite'>
          Background updating...
        </p>
      )}
    </ul>
  )
}
