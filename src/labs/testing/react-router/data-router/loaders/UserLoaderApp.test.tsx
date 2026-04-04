import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { loaderRoutes } from './UserLoaderApp'
import { render, screen } from '@testing-library/react'

describe('UserLoaderApp', () => {
  test('loader uses route param', async () => {
    const router = createMemoryRouter(loaderRoutes, { initialEntries: ['/users/42'] })

    render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)

    expect(await screen.findByRole('heading', { name: 'User Profile' })).toBeInTheDocument()
    expect(screen.getByText('ID: 42')).toBeInTheDocument()
    expect(screen.getByText('Name: Denis')).toBeInTheDocument()
  })

  test('another param gives different loaded data', async () => {
    const router = createMemoryRouter(loaderRoutes, { initialEntries: ['/users/99'] })

    render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)

    expect(await screen.findByRole('heading', { name: 'User Profile' })).toBeInTheDocument()
    expect(screen.getByText('ID: 99')).toBeInTheDocument()
    expect(screen.getByText('Name: Guest')).toBeInTheDocument()
  })
})
