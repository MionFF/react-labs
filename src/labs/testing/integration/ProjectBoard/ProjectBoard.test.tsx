import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import ProjectBoard from './ProjectBoard'
import userEvent from '@testing-library/user-event'

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

describe('ProjectBoard', () => {
  test('initial state', async () => {
    const fetchProjects = jest.fn().mockResolvedValue([
      { id: 1, name: 'spb-guide', archived: true },
      { id: 2, name: 'estrella-libros', archived: false },
      { id: 3, name: 'cali-club', archived: false },
    ])

    const archiveProject = jest.fn().mockResolvedValue(undefined)

    renderWithClient(<ProjectBoard fetchProjects={fetchProjects} archiveProject={archiveProject} />)

    expect(screen.getByText('Loading projects...')).toBeInTheDocument()
    expect(await screen.findByRole('list', { name: 'Projects list' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Project Board' })).toBeInTheDocument()

    const spbItem = screen.getByText('spb-guide').closest('li')
    expect(spbItem).not.toBeNull()
    expect(
      within(spbItem as HTMLElement).queryByRole('button', { name: 'Archive' }),
    ).not.toBeInTheDocument()

    const caliClubItem = screen.getByText('cali-club').closest('li')
    expect(caliClubItem).not.toBeNull()
    expect(
      within(caliClubItem as HTMLElement).getByRole('button', { name: 'Archive' }),
    ).toBeInTheDocument()
  })

  test('calls archiveProject on correct item on button click', async () => {
    const user = userEvent.setup()
    const deferred = createDeferred<void>()

    const fetchProjects = jest
      .fn()
      .mockResolvedValueOnce([
        { id: 1, name: 'spb-guide', archived: true },
        { id: 2, name: 'estrella-libros', archived: false },
        { id: 3, name: 'cali-club', archived: false },
      ])
      .mockResolvedValueOnce([
        { id: 1, name: 'spb-guide', archived: true },
        { id: 2, name: 'estrella-libros', archived: true },
        { id: 3, name: 'cali-club', archived: false },
      ])

    const archiveProject = jest.fn().mockReturnValue(deferred.promise)

    renderWithClient(<ProjectBoard fetchProjects={fetchProjects} archiveProject={archiveProject} />)

    const elTitle = await screen.findByText('estrella-libros')
    const elItem = elTitle.closest('li')
    expect(elItem).not.toBeNull()

    await user.click(within(elItem as HTMLElement).getByRole('button', { name: 'Archive' }))

    expect(archiveProject).toHaveBeenCalledWith(2, expect.anything())
    expect(
      within(elItem as HTMLElement).getByRole('button', { name: 'Archiving...' }),
    ).toBeDisabled()

    deferred.resolve(undefined)

    expect(await screen.findByText('cali-club')).toBeInTheDocument()
    expect(screen.queryByText('Failed to archive project')).not.toBeInTheDocument()
  })

  test('shows error on archiveProject fail', async () => {
    const user = userEvent.setup()

    const fetchProjects = jest.fn().mockResolvedValue([
      { id: 1, name: 'spb-guide', archived: true },
      { id: 2, name: 'estrella-libros', archived: false },
      { id: 3, name: 'cali-club', archived: false },
    ])

    const archiveProject = jest.fn().mockRejectedValue(new Error('Failed to archive project'))

    renderWithClient(<ProjectBoard fetchProjects={fetchProjects} archiveProject={archiveProject} />)

    expect(await screen.findByRole('list', { name: 'Projects list' })).toBeInTheDocument()
    const elItem = screen.getByText('estrella-libros').closest('li')
    expect(elItem).not.toBeNull()
    const elButton = within(elItem as HTMLElement).getByRole('button', { name: 'Archive' })
    await user.click(elButton)

    expect(archiveProject).toHaveBeenCalledWith(2, expect.anything())
    expect(archiveProject).toHaveBeenCalledTimes(1)

    expect(await screen.findByText('Failed to archive project')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Projects list' })).toBeInTheDocument()
  })

  test('shows empty message', async () => {
    const fetchProjects = jest.fn().mockResolvedValue([])

    const archiveProject = jest.fn().mockResolvedValue(undefined)

    renderWithClient(<ProjectBoard fetchProjects={fetchProjects} archiveProject={archiveProject} />)

    expect(await screen.findByText('No projects found')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Projects list' })).not.toBeInTheDocument()
    expect(screen.queryByText('Failed to load projects')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument()
  })

  test('shows error on fetchProjects fail', async () => {
    const fetchProjects = jest.fn().mockRejectedValue(new Error('Failed to load projects'))

    const archiveProject = jest.fn().mockResolvedValue(undefined)

    renderWithClient(<ProjectBoard fetchProjects={fetchProjects} archiveProject={archiveProject} />)

    expect(await screen.findByText('Failed to load projects')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Projects list' })).not.toBeInTheDocument()
    expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument()
    expect(screen.queryByText('No projects found')).not.toBeInTheDocument()
  })

  test('switches filters', async () => {
    const user = userEvent.setup()

    const fetchProjects = jest.fn().mockResolvedValue([
      { id: 1, name: 'spb-guide', archived: true },
      { id: 2, name: 'estrella-libros', archived: false },
      { id: 3, name: 'cali-club', archived: false },
    ])

    const archiveProject = jest.fn().mockResolvedValue(undefined)

    renderWithClient(<ProjectBoard fetchProjects={fetchProjects} archiveProject={archiveProject} />)

    expect(await screen.findByRole('list', { name: 'Projects list' })).toBeInTheDocument()

    expect(fetchProjects).toHaveBeenCalledWith('active')

    const spbItem = screen.getByText('spb-guide').closest('li')
    expect(spbItem).not.toBeNull()
    expect(
      within(spbItem as HTMLElement).queryByRole('button', { name: 'Archive' }),
    ).not.toBeInTheDocument()

    const elItem = screen.getByText('estrella-libros').closest('li')
    expect(elItem).not.toBeNull()
    expect(
      within(elItem as HTMLElement).getByRole('button', { name: 'Archive' }),
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Active' })).toBeDisabled()
    const archivedFilterBtn = screen.getByRole('button', { name: 'Archived' })
    expect(archivedFilterBtn).toBeEnabled()

    await user.click(archivedFilterBtn)

    expect(fetchProjects).toHaveBeenCalledWith('archived')

    expect(archivedFilterBtn).toBeDisabled()

    expect(
      within(spbItem as HTMLElement).queryByRole('button', { name: 'Archive' }),
    ).not.toBeInTheDocument()

    expect(
      within(elItem as HTMLElement).queryByRole('button', { name: 'Archive' }),
    ).not.toBeInTheDocument()
  })
})
