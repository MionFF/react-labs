import { render, screen } from '@testing-library/react'
import { Greeting } from './Greeting'
import { fetchGreeting } from './api'

jest.mock('./api', () => ({
  fetchGreeting: jest.fn(),
}))

describe('Greeting', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('shows "Hello from API" on success', async () => {
    ;(fetchGreeting as jest.Mock).mockResolvedValue('Hello from API')

    render(<Greeting />)

    expect(await screen.findByText('Hello from API')).toBeInTheDocument()
  })

  test('shows error on fail', async () => {
    ;(fetchGreeting as jest.Mock).mockRejectedValue(new Error('Failed to load'))

    render(<Greeting />)

    expect(await screen.findByText('Error')).toBeInTheDocument()
  })
})
