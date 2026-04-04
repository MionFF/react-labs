jest.mock('./todosApi', () => ({
  fetchTodos: jest.fn(),
  createTodo: jest.fn(),
}))

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import TodoBoard from './TodoBoard'
import { createTodo, fetchTodos } from './todosApi'
import userEvent from '@testing-library/user-event'

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('TodoBoard', () => {
  test('initial load', async () => {
    const mockedFetchedTodos = fetchTodos as jest.MockedFunction<typeof fetchTodos>
    mockedFetchedTodos.mockResolvedValue([{ id: 1, title: 'Learn testing' }])

    renderWithClient(<TodoBoard />)

    expect(screen.getByText('Loading todos...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Todos list' })).toBeInTheDocument()
    expect(screen.getByText('Learn testing')).toBeInTheDocument()
    expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument()
  })

  test('successful add updates board', async () => {
    const user = userEvent.setup()

    const mockedFetchedTodos = fetchTodos as jest.MockedFunction<typeof fetchTodos>
    mockedFetchedTodos
      .mockResolvedValueOnce([{ id: 1, title: 'Learn testing' }])
      .mockResolvedValueOnce([
        { id: 1, title: 'Learn testing' },
        { id: 2, title: 'Learn Next.js' },
      ])

    const mockedCreateTodo = createTodo as jest.MockedFunction<typeof createTodo>
    mockedCreateTodo.mockResolvedValue(undefined)

    renderWithClient(<TodoBoard />)

    expect(screen.getByText('Loading todos...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Todos list' })).toBeInTheDocument()

    const input = screen.getByLabelText('Todo title')
    await user.type(input, 'Learn Next.js')

    const button = screen.getByRole('button', { name: 'Add todo' })
    await user.click(button)

    expect(await screen.findByText('Learn Next.js')).toBeInTheDocument()
    expect(mockedCreateTodo).toHaveBeenCalledWith({ title: 'Learn Next.js' }, expect.anything())
    expect(screen.getByText('Todo added')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  test('failed add shows error and does not refresh list', async () => {
    const user = userEvent.setup()

    const mockedFetchedTodos = fetchTodos as jest.MockedFunction<typeof fetchTodos>
    mockedFetchedTodos.mockResolvedValue([{ id: 1, title: 'Learn testing' }])

    const mockedCreateTodo = createTodo as jest.MockedFunction<typeof createTodo>
    mockedCreateTodo.mockRejectedValue(new Error('Failed to add todo'))

    renderWithClient(<TodoBoard />)

    expect(screen.getByText('Loading todos...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Todos list' })).toBeInTheDocument()
    expect(screen.getByText('Learn testing')).toBeInTheDocument()

    const input = screen.getByLabelText('Todo title')
    await user.type(input, 'Learn Next.js')

    const button = screen.getByRole('button', { name: 'Add todo' })
    await user.click(button)

    expect(await screen.findByText('Failed to add todo')).toBeInTheDocument()
    expect(screen.queryByText('Learn Next.js')).not.toBeInTheDocument()
    expect(screen.queryByText('Todo added')).not.toBeInTheDocument()
  })
})
