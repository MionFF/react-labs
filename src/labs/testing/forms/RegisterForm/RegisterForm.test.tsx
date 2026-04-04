import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterForm from './RegisterForm'

async function fillValidForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<{
    name: string
    email: string
    password: string
    confirmPassword: string
  }> = {},
) {
  const values = {
    name: 'Denis',
    email: 'denis@example.com',
    password: 'secret123',
    confirmPassword: 'secret123',
    ...overrides,
  }

  await user.type(screen.getByLabelText(/name/i), values.name)
  await user.type(screen.getByLabelText(/email/i), values.email)
  await user.type(screen.getByLabelText(/^password/i), values.password)
  await user.type(screen.getByLabelText(/confirm password/i), values.confirmPassword)

  return values
}

describe('RegisterForm', () => {
  test('all fields are visible and submit button disabled by default', () => {
    const submitForm = jest.fn()

    render(<RegisterForm submitForm={submitForm} />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  test('shows password confirmation error on confirmPassword mismatch', async () => {
    const user = userEvent.setup()
    const submitForm = jest.fn().mockResolvedValue(undefined)

    render(<RegisterForm submitForm={submitForm} />)

    await fillValidForm(user, { confirmPassword: 'secret12' })

    expect(screen.getByRole('alert')).toHaveTextContent('Confirm password mismatch')
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  test('sends correct payload on valid submit data', async () => {
    const user = userEvent.setup()
    const submitForm = jest.fn().mockResolvedValue(undefined)

    render(<RegisterForm submitForm={submitForm} />)

    await fillValidForm(user)

    const button = screen.getByRole('button', { name: /submit/i })
    expect(button).toBeEnabled()
    await user.click(button)

    expect(submitForm).toHaveBeenCalledTimes(1)
    expect(submitForm).toHaveBeenCalledWith({
      name: 'Denis',
      email: 'denis@example.com',
      password: 'secret123',
      confirmPassword: 'secret123',
    })
  })

  test('shows server error on taken email input', async () => {
    const user = userEvent.setup()
    const submitForm = jest.fn().mockResolvedValue(undefined)

    render(<RegisterForm submitForm={submitForm} />)

    await fillValidForm(user, { email: 'taken@example.com' })

    const button = screen.getByRole('button', { name: /submit/i })
    await user.click(button)

    expect(await screen.findByText('Email is already taken')).toBeInTheDocument()
    expect(submitForm).toHaveBeenCalledTimes(0)
  })

  test('shows field-level validation errors for invalid inputs', async () => {
    const user = userEvent.setup()
    const submitForm = jest.fn().mockResolvedValue(undefined)

    render(<RegisterForm submitForm={submitForm} />)

    await fillValidForm(user, {
      name: 'JS',
      email: 'lithium@',
      password: 'cerdo',
      confirmPassword: 'cerdo',
    })

    const button = screen.getByRole('button', { name: /submit/i })

    expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument()
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    expect(button).toBeDisabled()
  })
})
