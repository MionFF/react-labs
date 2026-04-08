import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { fetchTasks } from './tasksApi'

export default function TaskListPage() {
  const [searchParams] = useSearchParams()
  const showCreatedBanner = searchParams.get('created') === '1'

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    retry: false,
  })

  return (
    <section>
      <h1 className='font-semibold'>Tasks</h1>

      {showCreatedBanner ? <p>Task created successfully</p> : null}
      {isLoading ? <p>Loading tasks...</p> : null}
      {isError ? <p role='alert'>Failed to load tasks</p> : null}

      {!isLoading && !isError ? (
        <ul aria-label='Tasks list'>
          {data.map(task => (
            <li
              key={task.id}
              className='my-2 p-4 border rounded transition duration-200 ease hover:-translate-y-1 hover:bg-[#f3f3f3]'
            >
              {task.title} — {task.assigneeEmail}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
