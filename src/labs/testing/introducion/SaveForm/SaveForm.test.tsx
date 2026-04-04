import { render, screen } from '@testing-library/react'
import { SaveForm } from './SaveForm'
import userEvent from '@testing-library/user-event'

describe('SaveForm', () => {
  test('calls onSave once with "Denis" after click', async () => {
    const onSave = jest.fn()
    const user = userEvent.setup()

    render(<SaveForm onSave={onSave} />)

    const saveBtn = screen.getByRole('button', { name: /save/i })
    await user.click(saveBtn)

    expect(onSave).toHaveBeenCalledWith('Denis')
    expect(onSave).toHaveBeenCalledTimes(1)
  })
})
