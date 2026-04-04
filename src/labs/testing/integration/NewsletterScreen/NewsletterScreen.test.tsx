import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewsletterScreen from './NewsletterScreen'

describe('NewsletterScreen', () => {
  test('invalid input blocks submit', async () => {
    const user = userEvent.setup()
    const saveEmail = jest.fn().mockResolvedValue(undefined)

    render(<NewsletterScreen saveEmail={saveEmail} />)

    const input = screen.getByLabelText(/email/i)
    await user.type(input, 'medianoche')

    expect(screen.getByText('Enter a valid email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeDisabled()
    expect(saveEmail).toHaveBeenCalledTimes(0)
  })

  test('valid submit shows success feedback', async () => {
    const user = userEvent.setup()
    const saveEmail = jest.fn().mockResolvedValue(undefined)

    render(<NewsletterScreen saveEmail={saveEmail} />)

    const input = screen.getByLabelText(/email/i)
    await user.type(input, 'medianoche@gmail.com')

    const button = screen.getByRole('button', { name: /subscribe/i })
    await user.click(button)

    expect(saveEmail).toHaveBeenCalledTimes(1)
    expect(saveEmail).toHaveBeenCalledWith({ email: 'medianoche@gmail.com' })
    expect(await screen.findByText('Subscribed successfully')).toBeInTheDocument()
    expect(screen.queryByText('Subscription failed')).not.toBeInTheDocument()
  })
})
