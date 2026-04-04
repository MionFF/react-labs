import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmailForm from './EmailForm'

describe('EmailForm', () => {
  test('submit button is disabled by default', () => {
    render(<EmailForm submitEmail={jest.fn()} />)

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  test('shows validation error for invalid email', async () => {
    const user = userEvent.setup()

    render(<EmailForm submitEmail={jest.fn()} />)

    const input = screen.getByLabelText(/email/i)
    await user.type(input, 'medianoche')

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email')
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  test('calls submitEmail with correct payload on valid submit', async () => {
    const user = userEvent.setup()
    const submitEmail = jest.fn().mockResolvedValue(undefined)

    render(<EmailForm submitEmail={submitEmail} />)

    const input = screen.getByLabelText(/email/i)
    const button = screen.getByRole('button', { name: /submit/i })

    await user.type(input, 'medianoche@gmail.com')

    expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument()
    expect(button).toBeEnabled()

    await user.click(button)

    expect(submitEmail).toHaveBeenCalledTimes(1)
    expect(submitEmail).toHaveBeenCalledWith({
      email: 'medianoche@gmail.com',
    })
  })

  test('shows server error when submitEmail rejects', async () => {
    const user = userEvent.setup()
    const submitEmail = jest.fn().mockRejectedValue(new Error('Server error'))

    render(<EmailForm submitEmail={submitEmail} />)

    const input = screen.getByLabelText(/email/i)
    const button = screen.getByRole('button', { name: /submit/i })

    await user.type(input, 'medianoche@gmail.com')
    await user.click(button)

    expect(await screen.findByRole('alert')).toHaveTextContent('Server error')
    expect(submitEmail).toHaveBeenCalledTimes(1)
  })
})
