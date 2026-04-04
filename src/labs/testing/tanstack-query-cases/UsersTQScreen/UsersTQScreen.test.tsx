import { render, screen } from '@testing-library/react'
import UsersTQScreen from './UsersTQScreen'
import { fetchUsers } from './usersApi'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

jest.mock('./usersApi', () => ({
  fetchUsers: jest.fn(),
}))

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

describe('UsersTQScreen', () => {
  const mockUsers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Jack' },
  ]

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders users after successful query', async () => {
    const mockedFetchUsers = fetchUsers as jest.MockedFunction<typeof fetchUsers>
    mockedFetchUsers.mockResolvedValue(mockUsers)

    renderWithClient(<UsersTQScreen />)

    expect(screen.getByText('Loading users...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Users list' })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Loading users...')).not.toBeInTheDocument()
  })

  test('renders error state when query fails', async () => {
    const mockedFetchUsers = fetchUsers as jest.MockedFunction<typeof fetchUsers>
    mockedFetchUsers.mockRejectedValue(new Error('Failed to fetch users'))

    renderWithClient(<UsersTQScreen />)

    expect(screen.getByText('Loading users...')).toBeInTheDocument()
    expect(await screen.findByText('Failed to load users')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    expect(screen.queryByText('Loading users...')).not.toBeInTheDocument()
  })

  test('retries failed query and then renders users', async () => {
    const user = userEvent.setup()
    const mockedFetchUsers = fetchUsers as jest.MockedFunction<typeof fetchUsers>
    mockedFetchUsers
      .mockRejectedValueOnce(new Error('Failed to fetch users'))
      .mockResolvedValueOnce(mockUsers)

    renderWithClient(<UsersTQScreen />)

    expect(screen.getByText('Loading users...')).toBeInTheDocument()
    expect(await screen.findByText('Failed to load users')).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /retry/i })

    await user.click(button)

    expect(await screen.findByRole('list', { name: 'Users list' })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Failed to load users')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading users...')).not.toBeInTheDocument()
  })
})
