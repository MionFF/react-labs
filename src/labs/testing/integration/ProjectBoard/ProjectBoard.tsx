import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type Project = {
  id: number
  name: string
  archived: boolean
}

type Props = {
  fetchProjects: (filter: 'active' | 'archived') => Promise<Project[]>
  archiveProject: (id: number) => Promise<void>
}

export default function ProjectBoard({ fetchProjects, archiveProject }: Props) {
  const [filter, setFilter] = useState<'active' | 'archived'>('active')
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['projects', filter],
    queryFn: () => fetchProjects(filter),
    retry: false,
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: archiveProject,
    onSuccess: async () => {
      setError('')
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: () => {
      setError('Failed to archive project')
    },
  })

  async function handleArchive(id: number) {
    try {
      await mutateAsync(id)
    } catch {
      // handled by onError
    }
  }

  return (
    <section>
      <h1>Project Board</h1>

      <div>
        <button onClick={() => setFilter('active')} disabled={filter === 'active'}>
          Active
        </button>
        <button onClick={() => setFilter('archived')} disabled={filter === 'archived'}>
          Archived
        </button>
      </div>

      {error ? <p role='alert'>{error}</p> : null}

      {isLoading ? <p>Loading projects...</p> : null}
      {isError ? <p>Failed to load projects</p> : null}

      {!isLoading && !isError ? (
        data.length > 0 ? (
          <ul aria-label='Projects list'>
            {data.map(project => (
              <li key={project.id}>
                <span>{project.name}</span>

                {!project.archived && filter === 'active' ? (
                  <button onClick={() => handleArchive(project.id)} disabled={isPending}>
                    {isPending ? 'Archiving...' : 'Archive'}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found</p>
        )
      ) : null}
    </section>
  )
}
