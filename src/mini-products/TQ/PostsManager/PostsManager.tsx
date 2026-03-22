import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import TimeoutComponent from './TimeoutComponent'

type Post = {
  id: number
  title: string
  body: string
}

type CreatePostInput = {
  title: string
  body: string
}

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}?_limit=10`)
  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)
  return res.json()
}

async function createPost(values: CreatePostInput): Promise<Post> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })

  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)
  return res.json()
}

async function updatePost(values: { id: number; newTitle: string }): Promise<Post> {
  const res = await fetch(`${BASE_URL}/${values.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: values.newTitle }),
  })

  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)

  return res.json()
}

async function deletePost(id: number): Promise<number> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })

  if (!res.ok) throw new Error(`HTTP_ERROR: ${res.status}`)

  return id
}

const postsOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: fetchPosts,
})

function usePosts() {
  return useQuery(postsOptions)
}

export default function PostsManager() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null)

  const postsQuery = usePosts()

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setTitle('')
      setBody('')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const updatePostMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      setEditingPostId(null)
      setEditingTitle('')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setDeletingPostId(null)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: () => setDeletingPostId(null),
  })

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!title.trim() || !body.trim()) return

    createPostMutation.mutate({ title, body })
  }

  function onSaveEdit() {
    if (editingPostId === null || !editingTitle.trim()) return
    updatePostMutation.mutate({ id: editingPostId, newTitle: editingTitle })
  }

  function onDelete(id: number) {
    if (deletePostMutation.isPending) return
    setDeletingPostId(id)
    deletePostMutation.mutate(id)
  }

  if (postsQuery.isPending)
    return (
      <p role='status' aria-live='polite'>
        Loading posts...
      </p>
    )
  if (postsQuery.isError) return <p role='alert'>{postsQuery.error.message}</p>
  if (postsQuery.data.length === 0)
    return (
      <p role='status' aria-live='polite'>
        No posts found
      </p>
    )

  return (
    <div className='p-6'>
      <form onSubmit={onSubmit}>
        <label htmlFor='title-input'>Title:</label>
        <input
          type='text'
          id='title-input'
          className='mx-2 outline-none ring-2'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label htmlFor='body-input'>Body:</label>
        <textarea
          id='body-input'
          className='mx-2 outline-none ring-2 max-h-[300px]'
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <button
          type='submit'
          disabled={!title.trim() || !body.trim() || createPostMutation.isPending}
          className='p-1 border rounded cursor-pointer'
        >
          Create post
        </button>
        {postsQuery.isFetching && !postsQuery.isPending && (
          <p role='status' aria-live='polite'>
            Refreshing posts...
          </p>
        )}
        {createPostMutation.isPending && (
          <p role='status' aria-live='polite'>
            Saving...
          </p>
        )}
        {createPostMutation.isSuccess && (
          <TimeoutComponent timeout={1500}>
            <p role='status' aria-live='polite'>
              Created!
            </p>
          </TimeoutComponent>
        )}
        {createPostMutation.isError && <p role='alert'>{createPostMutation.error.message}</p>}
      </form>

      <ul className='mt-4 p-4'>
        {postsQuery.data.map(post => (
          <li
            key={post.id}
            className='my-2 p-4 border rounded transition duration-200 ease hover:-translate-y-1 hover:bg-[#f6f6f6]'
          >
            {editingPostId === post.id ? (
              <>
                <input
                  type='text'
                  placeholder='New title...'
                  className='mx-2 outline-none ring-2'
                  value={editingTitle}
                  onChange={e => setEditingTitle(e.target.value)}
                />
                <button
                  onClick={onSaveEdit}
                  type='button'
                  disabled={!editingTitle.trim() || updatePostMutation.isPending}
                  className='p-1 mr-2 border rounded cursor-pointer'
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingPostId(null)
                    setEditingTitle('')
                  }}
                  type='button'
                  className='p-1 border rounded cursor-pointer'
                >
                  Cancel
                </button>
              </>
            ) : (
              <h2 className='font-semibold'>{post.title}</h2>
            )}

            {editingPostId === post.id && updatePostMutation.isPending && (
              <p role='status' aria-live='polite'>
                Saving changes...
              </p>
            )}
            {editingPostId === post.id && updatePostMutation.isError && (
              <p role='alert'>{updatePostMutation.error.message}</p>
            )}

            <p>{post.body}</p>
            <button
              onClick={() => {
                setEditingPostId(post.id)
                setEditingTitle(post.title)
              }}
              type='button'
              disabled={editingPostId !== null}
              className='p-1 mx-2 border rounded cursor-pointer'
            >
              Edit title
            </button>

            <button
              onClick={() => onDelete(post.id)}
              type='button'
              disabled={deletePostMutation.isPending && deletingPostId === post.id}
              className='p-1 border rounded cursor-pointer'
            >
              Delete
            </button>

            {deletePostMutation.isPending && deletingPostId === post.id && (
              <p role='status' aria-live='polite'>
                Deleting...
              </p>
            )}
            {deletePostMutation.isError && deletingPostId === post.id && (
              <p role='alert'>{deletePostMutation.error.message}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
