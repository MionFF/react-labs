import { render, screen, within } from '@testing-library/react'
import UserStatusTable from './UserStatusTable'
import userEvent from '@testing-library/user-event'

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

describe('UserStatusTable', () => {
  test('initial state', () => {
    const users = [
      { id: 1, name: 'John', active: true },
      { id: 2, name: 'Alice', active: false },
    ]
    const onToggleActive = jest.fn().mockResolvedValue(undefined)

    render(<UserStatusTable users={users} onToggleActive={onToggleActive} />)

    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
    expect(screen.queryByText(/failed to update/i)).not.toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()

    const tr = screen.getByText('John').closest('tr')
    expect(tr).not.toBeNull()
    expect(
      within(tr as HTMLElement).getByRole('button', { name: 'Deactivate' }),
    ).toBeInTheDocument()
  })

  test('calls onToggleActive with correct arguments', async () => {
    const user = userEvent.setup()
    const users = [
      { id: 1, name: 'John', active: true },
      { id: 2, name: 'Alice', active: false },
    ]
    const onToggleActive = jest.fn().mockResolvedValue(undefined)

    render(<UserStatusTable users={users} onToggleActive={onToggleActive} />)

    const tr = screen.getByText('John').closest('tr')
    expect(tr).not.toBeNull()

    const button = within(tr as HTMLElement).getByRole('button', { name: 'Deactivate' })
    await user.click(button)

    expect(screen.queryByText(/failed to update/i)).not.toBeInTheDocument()
    expect(onToggleActive).toHaveBeenCalledWith(1, false)
    expect(onToggleActive).toHaveBeenCalledTimes(1)
  })

  test('shows error on fail', async () => {
    const user = userEvent.setup()
    const users = [
      { id: 1, name: 'John', active: true },
      { id: 2, name: 'Alice', active: false },
    ]
    const onToggleActive = jest.fn().mockRejectedValue(new Error('Failed to toggle status'))

    render(<UserStatusTable users={users} onToggleActive={onToggleActive} />)

    const tr = screen.getByText('John').closest('tr')
    expect(tr).not.toBeNull()

    const button = within(tr as HTMLElement).getByRole('button', { name: 'Deactivate' })
    await user.click(button)

    expect(await screen.findByText('Failed to update John')).toBeInTheDocument()
    expect(onToggleActive).toHaveBeenCalledWith(1, false)
    expect(onToggleActive).toHaveBeenCalledTimes(1)
  })

  test('only clicked row enters pending state', async () => {
    const user = userEvent.setup()
    const deferred = createDeferred<void>()

    const users = [
      { id: 1, name: 'John', active: true },
      { id: 2, name: 'Alice', active: false },
    ]

    const onToggleActive = jest.fn().mockReturnValue(deferred.promise)

    render(<UserStatusTable users={users} onToggleActive={onToggleActive} />)

    const johnRow = screen.getByText('John').closest('tr')
    const aliceRow = screen.getByText('Alice').closest('tr')

    expect(johnRow).not.toBeNull()
    expect(aliceRow).not.toBeNull()

    const johnButton = within(johnRow as HTMLElement).getByRole('button', {
      name: 'Deactivate',
    })
    expect(
      within(aliceRow as HTMLElement).getByRole('button', {
        name: 'Activate',
      }),
    ).toBeInTheDocument()

    await user.click(johnButton)

    expect(onToggleActive).toHaveBeenCalledWith(1, false)

    expect(within(johnRow as HTMLElement).getByRole('button', { name: 'Saving...' })).toBeDisabled()

    expect(within(aliceRow as HTMLElement).getByRole('button', { name: 'Activate' })).toBeEnabled()

    deferred.resolve(undefined)

    expect(
      await within(johnRow as HTMLElement).findByRole('button', { name: 'Deactivate' }),
    ).toBeEnabled()
  })
})
