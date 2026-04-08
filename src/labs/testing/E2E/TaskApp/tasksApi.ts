export type Task = {
  id: number
  title: string
  assigneeEmail: string
}

let tasksDb: Task[] = [{ id: 1, title: 'Fix login bug', assigneeEmail: 'qa@example.com' }]

export async function fetchTasks(): Promise<Task[]> {
  return tasksDb
}

export async function createTask(input: { title: string; assigneeEmail: string }): Promise<void> {
  if (input.title.toLowerCase() === 'error') {
    throw new Error('Server error')
  }

  tasksDb = [
    ...tasksDb,
    {
      id: Date.now(),
      title: input.title,
      assigneeEmail: input.assigneeEmail,
    },
  ]
}

export function resetTasksDb() {
  tasksDb = [{ id: 1, title: 'Fix login bug', assigneeEmail: 'qa@example.com' }]
}
