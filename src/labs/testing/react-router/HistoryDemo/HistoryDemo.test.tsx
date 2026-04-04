import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HistoryDemo from './HistoryDemo'
import userEvent from '@testing-library/user-event'

describe('HistoryDemo', () => {
  test('initial route in the middle of history', () => {
    render(
      <MemoryRouter initialEntries={['/step-1', '/step-2', '/review']} initialIndex={2}>
        <HistoryDemo />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Review' })).toBeInTheDocument()
    expect(screen.getByText('Path: /review')).toBeInTheDocument()
  })

  test('back navigate uses history', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/step-1', '/step-2', '/review']} initialIndex={2}>
        <HistoryDemo />
      </MemoryRouter>,
    )

    expect(screen.getByText('Path: /review')).toBeInTheDocument()

    const button = screen.getByRole('button', { name: 'Back' })
    await user.click(button)

    expect(screen.getByRole('heading', { name: 'Step 2' })).toBeInTheDocument()
    expect(screen.getByText('Path: /step-2')).toBeInTheDocument()
  })
})
