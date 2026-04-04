import { render, screen } from '@testing-library/react'
import { UserSearch } from './UserSearch'
import userEvent from '@testing-library/user-event'

describe('UserSearch', () => {
  const mockUsers = ['Alice', 'Jack', 'Alan']

  test('renders heading and list', () => {
    render(<UserSearch users={mockUsers} />)

    const heading = screen.getByRole('heading', { name: /User Search/i })
    const ul = screen.queryByRole('list', { name: /users list/i })

    expect(heading).toBeInTheDocument()
    expect(ul).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Jack')).toBeInTheDocument()
    expect(screen.getByText('Alan')).toBeInTheDocument()
  })

  test('filters users by typed query', async () => {
    const user = userEvent.setup()

    render(<UserSearch users={mockUsers} />)

    const input = screen.getByLabelText(/search/i)

    await user.type(input, 'al')

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Alan')).toBeInTheDocument()
    expect(screen.queryByText('Jack')).not.toBeInTheDocument()
    expect(screen.queryByText(/No matches/i)).not.toBeInTheDocument()
  })

  test('renders empty state', async () => {
    const user = userEvent.setup()

    render(<UserSearch users={mockUsers} />)

    const input = screen.getByLabelText(/search/i)

    await user.type(input, 'Denis')

    expect(screen.getByText(/No matches/i)).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: /users list/i })).not.toBeInTheDocument()
  })
})
