import { render, screen } from '@testing-library/react'
import { CloseButton } from './CloseButton'
import userEvent from '@testing-library/user-event'

describe('CloseButton', () => {
  test('calls onClose once', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()

    render(<CloseButton onClose={onClose} />)

    const button = screen.getByRole('button', { name: /close/i })

    await user.click(button)

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
