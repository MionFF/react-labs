jest.mock('./usersApi', () => ({
  searchUsers: jest.fn(),
}))

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UserDirectoryPage } from './UserDirectoryPage'
import { searchUsers } from './usersApi'
import userEvent from '@testing-library/user-event'

function renderWithClient(ui: React.ReactElement, { route = '/users' } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[route]}
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        {ui}
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('UserDirectoryPage', () => {
  afterEach(() => jest.clearAllMocks())

  test('initial state', () => {
    const mockedSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>
    mockedSearchUsers.mockResolvedValue([])

    renderWithClient(<UserDirectoryPage />, { route: '/users' })

    expect(screen.getByRole('heading', { name: 'User Directory' })).toBeInTheDocument()
    expect(screen.getByLabelText('Search users')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
    expect(screen.getByText('Enter a search query')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Users list' })).not.toBeInTheDocument()
  })

  test('searches user and renders list on button click', async () => {
    const user = userEvent.setup()

    const mockedSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>
    mockedSearchUsers.mockResolvedValue([{ id: 1, name: 'Mion' }])

    renderWithClient(<UserDirectoryPage />, { route: '/users' })

    await user.type(screen.getByLabelText('Search users'), 'Mion')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByRole('list', { name: 'Users list' })).toBeInTheDocument()
    expect(screen.getByText('Mion')).toBeInTheDocument()
    expect(screen.queryByText('Failed to load users')).not.toBeInTheDocument()
    expect(screen.queryByText('No users found')).not.toBeInTheDocument()
    expect(screen.queryByText('Enter a search query')).not.toBeInTheDocument()

    expect(mockedSearchUsers).toHaveBeenCalledWith('Mion')
    expect(mockedSearchUsers).toHaveBeenCalledTimes(1)
  })

  test('shows error without list on fail', async () => {
    const user = userEvent.setup()

    const mockedSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>
    mockedSearchUsers.mockRejectedValue(new Error('Failed to search'))

    renderWithClient(<UserDirectoryPage />, { route: '/users' })

    await user.type(screen.getByLabelText('Search users'), 'Mion')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText('Failed to load users')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Users list' })).not.toBeInTheDocument()
    expect(screen.queryByText('Mion')).not.toBeInTheDocument()
    expect(screen.queryByText('No users found')).not.toBeInTheDocument()

    expect(mockedSearchUsers).toHaveBeenCalledWith('Mion')
    expect(mockedSearchUsers).toHaveBeenCalledTimes(1)
  })

  test('empty state', async () => {
    const user = userEvent.setup()

    const mockedSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>
    mockedSearchUsers.mockResolvedValue([])

    renderWithClient(<UserDirectoryPage />, { route: '/users' })

    await user.type(screen.getByLabelText('Search users'), 'Mion')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText('No users found')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Users list' })).not.toBeInTheDocument()
    expect(screen.queryByText('Mion')).not.toBeInTheDocument()
    expect(screen.queryByText('Enter a search query')).not.toBeInTheDocument()
    expect(screen.queryByText('Failed to load users')).not.toBeInTheDocument()

    expect(mockedSearchUsers).toHaveBeenCalledWith('Mion')
    expect(mockedSearchUsers).toHaveBeenCalledTimes(1)
  })

  test('clear button clears input field', async () => {
    const user = userEvent.setup()

    const mockedSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>
    mockedSearchUsers.mockResolvedValue([])

    renderWithClient(<UserDirectoryPage />, { route: '/users' })

    const input = screen.getByLabelText('Search users')
    await user.type(input, 'Mion')

    expect(input).toHaveValue('Mion')

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(input).toHaveValue('')
    expect(screen.getByText('Enter a search query')).toBeInTheDocument()
  })

  test('renders results from initial query param', async () => {
    const mockedSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>
    mockedSearchUsers.mockResolvedValue([{ id: 1, name: 'Mion' }])

    renderWithClient(<UserDirectoryPage />, { route: '/users?q=Mion' })

    expect(screen.getByText('Loading users...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Users list' })).toBeInTheDocument()
    expect(screen.getByText('Mion')).toBeInTheDocument()

    expect(screen.getByLabelText('Search users')).toHaveValue('Mion')
    expect(screen.queryByText('Enter a search query')).not.toBeInTheDocument()

    expect(mockedSearchUsers).toHaveBeenCalledWith('Mion')
    expect(mockedSearchUsers).toHaveBeenCalledTimes(1)
  })

  test('empty field submit', async () => {
    const user = userEvent.setup()

    const mockedSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>
    mockedSearchUsers.mockResolvedValue([{ id: 1, name: 'Mion' }])

    renderWithClient(<UserDirectoryPage />, { route: '/users' })

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText('Enter a search query')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Users list' })).not.toBeInTheDocument()
    expect(screen.queryByText('Mion')).not.toBeInTheDocument()

    expect(mockedSearchUsers).toHaveBeenCalledTimes(0)
  })
})
