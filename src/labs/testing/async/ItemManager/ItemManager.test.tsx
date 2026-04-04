import { render, screen, within } from '@testing-library/react'
import ItemManager from './ItemManager'
import userEvent from '@testing-library/user-event'

describe('ItemManager', () => {
  test('initial state', () => {
    const onDelete = jest.fn().mockResolvedValue(undefined)

    render(<ItemManager items={[{ id: 1, title: 'math' }]} onDelete={onDelete} />)

    expect(screen.getByRole('heading', { name: 'Item Manager' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Items list' })).toBeInTheDocument()

    const title = screen.getByText('math')
    expect(title).toBeInTheDocument()

    const li = title.closest('li')
    expect(li).not.toBeNull()
    expect(within(li as HTMLElement).getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  test('calls onDelete with currect id', async () => {
    const user = userEvent.setup()
    const onDelete = jest.fn().mockResolvedValue(undefined)

    render(<ItemManager items={[{ id: 1, title: 'math' }]} onDelete={onDelete} />)

    const li = screen.getByText('math').closest('li')
    expect(li).not.toBeNull()
    const button = within(li as HTMLElement).getByRole('button', { name: 'Delete' })
    await user.click(button)

    expect(screen.queryByText('Failed to delete item')).not.toBeInTheDocument()
    expect(onDelete).toHaveBeenCalledWith(1)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  test('shows error on fail', async () => {
    const user = userEvent.setup()
    const onDelete = jest.fn().mockRejectedValue(new Error('Failed to delete item'))

    render(<ItemManager items={[{ id: 1, title: 'math' }]} onDelete={onDelete} />)

    const li = screen.getByText('math').closest('li')
    expect(li).not.toBeNull()
    const button = within(li as HTMLElement).getByRole('button', { name: 'Delete' })
    await user.click(button)

    expect(await screen.findByText('Failed to delete item')).toBeInTheDocument()
    expect(li).toBeInTheDocument()
    expect(button).toHaveTextContent('Delete')
    expect(onDelete).toHaveBeenCalledWith(1)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
