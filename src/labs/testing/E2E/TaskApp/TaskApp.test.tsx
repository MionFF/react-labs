jest.mock('./tasksApi', () => ({
  fetchTasks: jest.fn(),
  createTask: jest.fn(),
}))

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Layout } from './TaskApp'
import userEvent from '@testing-library/user-event'
import { createTask, fetchTasks } from './tasksApi'

function renderWithClient(ui: React.ReactElement, { route = '/' } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <MemoryRouter
      initialEntries={[route]}
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  )
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

describe('TaskApp CreatePage', () => {
  afterEach(() => jest.clearAllMocks())

  test('renders create form initial state', () => {
    renderWithClient(<Layout />, { route: '/tasks/new' })

    expect(screen.getByRole('heading', { name: 'Create Task' })).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Assignee email')).toBeInTheDocument()

    const button = screen.getByRole('button', { name: 'Create task' })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()

    expect(screen.queryByText('Title must be at least 3 characters')).not.toBeInTheDocument()
    expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument()
  })

  test('shows validation errors on invalid field values', async () => {
    const user = userEvent.setup()

    const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>
    mockedCreateTask.mockResolvedValue(undefined)

    renderWithClient(<Layout />, { route: '/tasks/new' })

    await user.type(screen.getByLabelText('Title'), 'Ad')
    await user.type(screen.getByLabelText('Assignee email'), 'mikedev11@')

    expect(await screen.findByText('Title must be at least 3 characters')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Create task' })).toBeDisabled()

    expect(mockedCreateTask).toHaveBeenCalledTimes(0)
  })

  test('shows server error', async () => {
    const user = userEvent.setup()
    const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>
    mockedCreateTask.mockRejectedValue(new Error('Server error'))

    renderWithClient(<Layout />, { route: '/tasks/new' })

    await user.type(screen.getByLabelText('Title'), 'error')
    await user.type(screen.getByLabelText('Assignee email'), 'mikedev11@gmail.com')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(await screen.findByText('Failed to create task')).toBeInTheDocument()

    expect(mockedCreateTask).toHaveBeenCalledWith(
      { title: 'error', assigneeEmail: 'mikedev11@gmail.com' },
      expect.anything(),
    )
    expect(mockedCreateTask).toHaveBeenCalledTimes(1)
  })

  test('creates new task on successful submit and navigates to /tasks', async () => {
    const user = userEvent.setup()
    const deferred = createDeferred<void>()

    const mockedFetchTasks = fetchTasks as jest.MockedFunction<typeof fetchTasks>
    mockedFetchTasks.mockResolvedValue([
      { id: 1, title: 'Fix login bug', assigneeEmail: 'qa@example.com' },
      { id: 2, title: 'Implement new feature', assigneeEmail: 'mikedev11@gmail.com' },
    ])

    const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>
    mockedCreateTask.mockReturnValue(deferred.promise)

    renderWithClient(<Layout />, { route: '/tasks/new' })

    await user.type(screen.getByLabelText('Title'), 'Implement new feature')
    await user.type(screen.getByLabelText('Assignee email'), 'mikedev11@gmail.com')

    const button = await screen.findByRole('button', { name: 'Create task' })
    expect(button).toBeEnabled()

    await user.click(button)

    expect(mockedCreateTask).toHaveBeenCalledWith(
      {
        title: 'Implement new feature',
        assigneeEmail: 'mikedev11@gmail.com',
      },
      expect.anything(),
    )
    expect(mockedCreateTask).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'Create Task' })).toBeInTheDocument()

    deferred.resolve(undefined)

    expect(await screen.findByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByText('Task created successfully')).toBeInTheDocument()
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Tasks list' })).toBeInTheDocument()
    expect(screen.getByText(/Implement new feature/)).toBeInTheDocument()
    expect(screen.getByText(/mikedev11@gmail.com/)).toBeInTheDocument()
  })
})

describe('TaskApp Task List', () => {
  test('initial state', async () => {
    const mockedFetchTasks = fetchTasks as jest.MockedFunction<typeof fetchTasks>
    mockedFetchTasks.mockResolvedValue([
      { id: 1, title: 'Fix login bug', assigneeEmail: 'qa@example.com' },
    ])

    renderWithClient(<Layout />, { route: '/tasks' })

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Tasks list' })).toBeInTheDocument()
    expect(screen.getByText(/Fix login bug/)).toBeInTheDocument()
    expect(screen.getByText(/qa@example.com/)).toBeInTheDocument()
    expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument()
    expect(screen.queryByText('Task created successfully')).not.toBeInTheDocument()
  })

  test('shows error on fetchTasks failure', async () => {
    const mockedFetchTasks = fetchTasks as jest.MockedFunction<typeof fetchTasks>
    mockedFetchTasks.mockRejectedValue(new Error('Failed to load tasks'))

    renderWithClient(<Layout />, { route: '/tasks' })

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
    expect(await screen.findByText('Failed to load tasks')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Tasks list' })).not.toBeInTheDocument()
    expect(screen.queryByText('Task created successfully')).not.toBeInTheDocument()
  })
})
