import {
  createBrowserRouter,
  Form,
  Link,
  Outlet,
  redirect,
  RouterProvider,
  useActionData,
  useLoaderData,
} from 'react-router-dom'

type Task = { id: string; title: string }

type ActionData = {
  error?: string
  ok?: boolean
}

let tasks: Task[] = [{ id: '1', title: 'Read React Router docs' }]

function tasksLoader() {
  return tasks
}

async function tasksAction({ request }: { request: Request }): Promise<ActionData> {
  const formData = await request.formData()

  const title = String(formData.get('title') ?? '').trim()

  if (!title) return { error: 'Title is required!' }

  tasks = [...tasks, { id: String(tasks.length + 1), title }]

  return redirect('/tasks')
}

function RootLayout() {
  return (
    <div className='grid grid-rows-[60px_1fr]'>
      <header className='p-4 border-b'>
        <nav>
          <Link to='/tasks' className='underline'>
            Tasks
          </Link>
        </nav>
      </header>

      <main className='p-4'>
        <Outlet />
      </main>
    </div>
  )
}

function TasksPage() {
  const tasksList = useLoaderData() as Task[]
  const actionData = useActionData() as ActionData | undefined

  return (
    <>
      <Form method='post'>
        <label htmlFor='title'>Title:</label>
        <input type='text' name='title' id='title' className='mx-2 outline-none ring-2' />
        <button type='submit' className='p-1 border rounded cursor-pointer'>
          Submit
        </button>
      </Form>

      {actionData?.error ? (
        <p className='text-red-600' role='alert'>
          {actionData.error}
        </p>
      ) : null}

      <ul className='mt-4'>
        {tasksList.map(t => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [{ path: 'tasks', loader: tasksLoader, action: tasksAction, Component: TasksPage }],
  },
])

export default function TasksActionApp() {
  return <RouterProvider router={router} />
}
