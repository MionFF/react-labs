import { render, screen } from '@testing-library/react'
import { loadStatus } from './statusApi'
import { StatusBadge } from './StatusBadge'

jest.mock('./statusApi', () => ({
  loadStatus: jest.fn(),
}))

describe('StatusBadge', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('shows online status on success', async () => {
    // ;(loadStatus as jest.Mock).mockResolvedValue('Online')
    const mockedLoadStatus = loadStatus as jest.MockedFunction<typeof loadStatus>
    mockedLoadStatus.mockResolvedValue('Online')

    render(<StatusBadge />)

    expect(screen.getByText(/loading.../i)).toBeInTheDocument()
    expect(await screen.findByText(/online/i)).toBeInTheDocument()
    expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument()
  })

  test('shows offline status on failure', async () => {
    // ;(loadStatus as jest.Mock).mockRejectedValue(new Error('Connection issues'))
    const mockedLoadStatus = loadStatus as jest.MockedFunction<typeof loadStatus>
    mockedLoadStatus.mockRejectedValue(new Error('Connection issues'))

    render(<StatusBadge />)

    expect(screen.getByText(/loading.../i)).toBeInTheDocument()
    expect(await screen.findByText(/offline/i)).toBeInTheDocument()
    expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument()
    expect(screen.queryByText(/online/i)).not.toBeInTheDocument()
  })
})
