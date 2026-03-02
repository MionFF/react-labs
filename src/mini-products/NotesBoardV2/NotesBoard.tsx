import { useMemo, useReducer, useState } from 'react'
import type { Note, NotesAction, NotesState, SortBy } from './types'
import NotesList from './NotesList'
import NotesToolbar from './NotesToolbar'
import AddNoteForm from './AddNoteForm'

const DATA: Note[] = [
  {
    id: crypto.randomUUID(),
    title: 'Note 1',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
    updatedAt: Date.now(),
    pinned: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Note 2',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
    updatedAt: Date.now(),
    pinned: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Note 3',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
    updatedAt: Date.now(),
    pinned: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Note 4',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
    updatedAt: Date.now(),
    pinned: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Note 5',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
    updatedAt: Date.now(),
    pinned: false,
  },
]

function notesReducer(state: NotesState, action: NotesAction) {
  switch (action.type) {
    case 'notes/togglePin': {
      return {
        notes: state.notes.map(n => (n.id === action.id ? { ...n, pinned: !n.pinned } : n)),
      }
    }

    case 'notes/delete': {
      return {
        notes: state.notes.filter(n => n.id !== action.id),
      }
    }

    case 'notes/add': {
      return {
        notes: [...state.notes, action.note],
      }
    }

    case 'notes/set': {
      return { notes: action.notes }
    }

    case 'notes/update': {
      return {
        notes: state.notes.map(n => (n.id === action.id ? { ...n, ...action.patch } : n)),
      }
    }

    default:
      return state
  }
}

export default function NotesBoard() {
  const [notesState, dispatch] = useReducer(notesReducer, { notes: DATA })
  const notes = notesState.notes
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('title')
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)

  const onQueryChange = (next: string) => {
    setQuery(next)
  }

  const onSortByChange = (next: SortBy) => {
    setSortBy(next)
  }

  const onShowPinnedOnlyChange = (next: boolean) => {
    setShowPinnedOnly(next)
  }

  const onTogglePin = (id: string) => {
    dispatch({ type: 'notes/togglePin', id: id })
  }

  const onAddNote = (note: Note) => {
    dispatch({ type: 'notes/add', note })
  }

  const onDeleteNote = (id: string) => {
    dispatch({ type: 'notes/delete', id })
  }

  const onUpdateNote = (id: string) => {
    const nextTitle = prompt('New title?')
    if (nextTitle === null) return

    const title = nextTitle.trim()
    if (!title) return

    dispatch({
      type: 'notes/update',
      id,
      patch: { title, updatedAt: Date.now() },
    })
  }

  const visibleNotes = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filteredNotes = notes
      .filter(n =>
        q ? n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q) : true,
      )
      .filter(n => (showPinnedOnly ? n.pinned : true))
    const sortedNotes = filteredNotes.toSorted((a, b) =>
      sortBy === 'title'
        ? a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        : b.updatedAt - a.updatedAt,
    )
    const pinned = sortedNotes.filter(n => n.pinned)
    const unpinned = sortedNotes.filter(n => !n.pinned)
    return [...pinned, ...unpinned]
  }, [notes, query, showPinnedOnly, sortBy])

  const emptyMessage = notes.length ? 'No matches' : 'No notes yet'

  return (
    <div className='min-h-screen bg-[#333] text-white'>
      <NotesToolbar
        query={query}
        onQueryChange={onQueryChange}
        sortBy={sortBy}
        onSortByChange={onSortByChange}
        showPinnedOnly={showPinnedOnly}
        onShowPinnedOnlyChange={onShowPinnedOnlyChange}
      />
      <AddNoteForm onAdd={onAddNote} />
      <NotesList
        notes={visibleNotes}
        emptyMessage={emptyMessage}
        onTogglePin={onTogglePin}
        onDelete={onDeleteNote}
        onEditTitle={onUpdateNote}
      />
    </div>
  )
}
