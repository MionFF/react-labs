import { render, screen } from '@testing-library/react'
import SearchParamsDemo from './SearchParamsDemo'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

describe('SearchParamsDemo', () => {
  test('default category', () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <SearchParamsDemo />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()
    expect(screen.getByText('Category: all')).toBeInTheDocument()
  })

  test('initial query param', () => {
    render(
      <MemoryRouter initialEntries={['/products?category=books']}>
        <SearchParamsDemo />
      </MemoryRouter>,
    )

    expect(screen.getByText('Category: books')).toBeInTheDocument()
  })

  test('navigation updates search params', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/products']}>
        <SearchParamsDemo />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'Games' })
    await user.click(link)

    expect(await screen.findByText('Category: games')).toBeInTheDocument()
  })
})
