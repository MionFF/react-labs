import { render, screen } from '@testing-library/react'
import { AsyncUsers } from './AsyncUsers'

describe('AsyncUsers', () => {
  test('shows users after successful load', async () => {
    const loadUsersSuccess = jest.fn().mockResolvedValue([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Jack' },
      { id: 3, name: 'Alan' },
    ])

    render(<AsyncUsers loadUsers={loadUsersSuccess} />)

    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument()

    expect(await screen.findByRole('list', { name: /Users list/i })).toBeInTheDocument()
    expect(screen.getByText(/Alice/i)).toBeInTheDocument()
    expect(screen.getByText(/Jack/i)).toBeInTheDocument()
    expect(screen.getByText(/Alan/i)).toBeInTheDocument()

    expect(screen.queryByText(/Loading users.../i)).not.toBeInTheDocument()
    expect(loadUsersSuccess).toHaveBeenCalledTimes(1)
  })

  test('shows error state when loading fails', async () => {
    const rejectMockFn = jest.fn().mockRejectedValue(new Error('Failed to load'))

    render(<AsyncUsers loadUsers={rejectMockFn} />)

    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument()

    expect(await screen.findByText(/Failed to load users/i)).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: /Users list/i })).not.toBeInTheDocument()

    expect(screen.queryByText(/Loading users.../i)).not.toBeInTheDocument()
  })
})
