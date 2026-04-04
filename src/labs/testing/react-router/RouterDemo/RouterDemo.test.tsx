import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RouterDemo from './RouterDemo'
import userEvent from '@testing-library/user-event'

describe('RouterDemo', () => {
  test('initial route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <RouterDemo />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByText('Current path: /')).toBeInTheDocument()
  })

  test('navigation', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/']}>
        <RouterDemo />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'Open profile' })
    expect(link).toBeInTheDocument()
    await user.click(link)

    expect(await screen.findByText('User 42')).toBeInTheDocument()
    expect(screen.getByText('Current path: /users/42'))
  })

  test('direct route with params', () => {
    render(
      <MemoryRouter initialEntries={['/users/99']}>
        <RouterDemo />
      </MemoryRouter>,
    )

    expect(screen.getByText('User 99'))
    expect(screen.getByText('Current path: /users/99'))
  })
})
