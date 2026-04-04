import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './RouterDemoApp'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('RouterDemoApp', () => {
  test('initial home route', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })

    render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)

    expect(screen.getByRole('heading', { name: 'Home Page' })).toBeInTheDocument()
  })

  test('direct param route', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/users/99'] })

    render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)

    expect(screen.getByRole('heading', { name: 'User page: 99' })).toBeInTheDocument()
  })

  test('navigation through route tree', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })

    render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)

    expect(screen.getByRole('heading', { name: 'Home Page' })).toBeInTheDocument()

    const link = screen.getByRole('link', { name: 'User 42' })
    await user.click(link)

    expect(await screen.findByRole('heading', { name: 'User page: 42' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Home Page' })).not.toBeInTheDocument()
  })
})
