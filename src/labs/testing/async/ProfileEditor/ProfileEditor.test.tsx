import { render, screen } from '@testing-library/react'
import ProfileEditor from './ProfileEditor'
import userEvent from '@testing-library/user-event'

describe('ProfileEditor', () => {
  test('initial state', () => {
    const saveProfile = jest.fn().mockResolvedValue(undefined)
    render(<ProfileEditor saveProfile={saveProfile} />)

    expect(screen.getByRole('heading', { name: 'Profile Editor' })).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()

    expect(screen.queryByText('Profile saved')).not.toBeInTheDocument()
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
    expect(screen.queryByText('Failed to save profile')).not.toBeInTheDocument()
  })

  test('shows message on success submit', async () => {
    const user = userEvent.setup()

    const saveProfile = jest.fn().mockResolvedValue(undefined)
    render(<ProfileEditor saveProfile={saveProfile} />)

    const input = screen.getByLabelText('Name')
    await user.type(input, 'Denis')

    const button = screen.getByRole('button', { name: 'Save' })
    await user.click(button)

    expect(await screen.findByText('Profile saved')).toBeInTheDocument()
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
    expect(input).toHaveValue('')
    expect(saveProfile).toHaveBeenCalledTimes(1)
    expect(saveProfile).toHaveBeenCalledWith({ name: 'Denis' })
  })

  test('shows error on submit with empty field', async () => {
    const user = userEvent.setup()

    const saveProfile = jest.fn().mockResolvedValue(undefined)
    render(<ProfileEditor saveProfile={saveProfile} />)

    const button = screen.getByRole('button', { name: 'Save' })
    await user.click(button)

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.queryByText('Profile saved')).not.toBeInTheDocument()
    expect(saveProfile).toHaveBeenCalledTimes(0)
  })

  test('shows error on request failure', async () => {
    const user = userEvent.setup()

    const saveProfile = jest.fn().mockRejectedValue(new Error('Failed to save'))
    render(<ProfileEditor saveProfile={saveProfile} />)

    await user.type(screen.getByLabelText('Name'), 'Denis')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Failed to save profile')).toBeInTheDocument()
    expect(screen.queryByText('Profile saved')).not.toBeInTheDocument()
    expect(saveProfile).toHaveBeenCalledTimes(1)
    expect(saveProfile).toHaveBeenCalledWith({ name: 'Denis' })
  })
})
