import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import ProductsApp from './ProductsApp'
import { render, screen } from '@testing-library/react'
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

describe('ProductsPage', () => {
  test('initial route loads books', async () => {
    const fetchProducts = jest.fn().mockResolvedValue([
      { id: 1, name: 'Joyland', category: 'books' },
      { id: 2, name: 'The shining', category: 'books' },
    ])

    renderWithClient(
      <MemoryRouter
        initialEntries={['/products?category=books']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ProductsApp fetchProducts={fetchProducts} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Loading products...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Products list' })).toBeInTheDocument()
    expect(screen.getByText('Joyland')).toBeInTheDocument()
    expect(fetchProducts).toHaveBeenCalledWith('books')
  })

  test('navigation updates URL-driven query and renders new list', async () => {
    const user = userEvent.setup()

    const fetchProducts = jest
      .fn()
      .mockResolvedValueOnce([
        { id: 1, name: 'Joyland', category: 'books' },
        { id: 2, name: 'The Shining', category: 'books' },
      ])
      .mockResolvedValueOnce([
        { id: 3, name: 'Stardew Valley', category: 'games' },
        { id: 4, name: 'Subnautica', category: 'games' },
      ])

    renderWithClient(
      <MemoryRouter
        initialEntries={['/products?category=books']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ProductsApp fetchProducts={fetchProducts} />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Joyland')).toBeInTheDocument()
    expect(fetchProducts).toHaveBeenCalledWith('books')

    const link = screen.getByRole('link', { name: 'Games' })
    await user.click(link)

    expect(await screen.findByText('Subnautica')).toBeInTheDocument()
    expect(screen.queryByText('Joyland')).not.toBeInTheDocument()
    expect(fetchProducts).toHaveBeenCalledWith('games')
  })
})
