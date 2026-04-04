jest.mock('./todosApi', () => ({
  fetchTodos: jest.fn(),
  createTodo: jest.fn(),
}))

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TodosTQScreen from './TodosTQScreen'
import { render, screen } from '@testing-library/react'
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

describe('TodosTQScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('shows todo list on success', async () => {
    const mockedFetchTodos = fetchTodos as jest.MockedFunction<typeof fetchTodos>
    mockedFetchTodos.mockResolvedValue([
      { id: 1, title: 'Learn testing' },
      { id: 2, title: 'Write RTL tests' },
    ])

    renderWithClient(<TodosTQScreen />)

    expect(screen.getByText('Loading todos...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Todos list' })).toBeInTheDocument()
    expect(screen.getByText('Learn testing')).toBeInTheDocument()
    expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument()
  })

  test('shows error on failure', async () => {
    const mockedFetchTodos = fetchTodos as jest.MockedFunction<typeof fetchTodos>
    mockedFetchTodos.mockRejectedValue(new Error('Failed to load todos'))

    renderWithClient(<TodosTQScreen />)

    expect(screen.getByText('Loading todos...')).toBeInTheDocument()
    expect(await screen.findByText('Failed to load todos')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Todos list' })).not.toBeInTheDocument()
    expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument()
  })

  test('adds todo and refreshes the list after mutation', async () => {
    const user = userEvent.setup()
    const mockedFetchTodos = fetchTodos as jest.MockedFunction<typeof fetchTodos>
    mockedFetchTodos
      .mockResolvedValueOnce([
        { id: 1, title: 'Learn testing' },
        { id: 2, title: 'Write RTL tests' },
      ])
      .mockResolvedValueOnce([
        { id: 1, title: 'Learn testing' },
        { id: 2, title: 'Write RTL tests' },
        { id: 3, title: 'Ship feature' },
      ])
    const mockedCreateTodo = createTodo as jest.MockedFunction<typeof createTodo>
    mockedCreateTodo.mockResolvedValue(undefined)

    renderWithClient(<TodosTQScreen />)
    expect(screen.getByText('Loading todos...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Todos list' })).toBeInTheDocument()
    expect(screen.getByText('Learn testing')).toBeInTheDocument()

    const input = screen.getByLabelText(/Todo title/i)
    await user.type(input, 'Ship feature')

    const button = screen.getByRole('button', { name: /Add/i })
    expect(button).toBeEnabled()
    await user.click(button)

    expect(await screen.findByText('Ship feature')).toBeInTheDocument()
    expect(input).toHaveValue('')

    expect(mockedCreateTodo).toHaveBeenCalledTimes(1)
  })
})
