import { render, screen } from '@testing-library/react'
import { UsersQueryScreen } from './UsersQueryScreen'
import userEvent from '@testing-library/user-event'

describe('UsersQueryScreen', () => {
  const mockUsers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Jack' },
    { id: 3, name: 'Alan' },
  ]

  test('shows success state and loading state before it', async () => {
    const loadUsersSuccess = jest.fn().mockResolvedValue(mockUsers)
    render(<UsersQueryScreen loadUsers={loadUsersSuccess} />)

    expect(screen.getByText('Loading users...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Users list' })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Loading users...')).not.toBeInTheDocument()
  })

  test('shows error state and loading state before it', async () => {
    const loadUsersError = jest.fn().mockRejectedValue(new Error('Failed to load users'))
    render(<UsersQueryScreen loadUsers={loadUsersError} />)

    expect(screen.getByText('Loading users...')).toBeInTheDocument()
    expect(await screen.findByText('Failed to load users')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  test('shows error and retry button, retries on click and shows success state then', async () => {
    const user = userEvent.setup()
    const loadUsersWithRetry = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed to load users'))
      .mockResolvedValueOnce(mockUsers)

    render(<UsersQueryScreen loadUsers={loadUsersWithRetry} />)

    expect(screen.getByText('Loading users...')).toBeInTheDocument()
    expect(await screen.findByText('Failed to load users')).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /retry/i })

    await user.click(button)

    expect(await screen.findByRole('list', { name: 'Users list' })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument()
    expect(screen.queryByText('Failed to load users')).not.toBeInTheDocument()
  })
})
